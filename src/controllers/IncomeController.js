import moment from 'moment'
import { Op } from 'sequelize'
import model from '../models'

class IncomeController {

    create = async (req, res) => {
        const { month, year, type, name, amount } = req.body
        try {
            const member = await model.member.findOne({
                where: { name },
                raw: true
            })
            if (!member) return res.status(404).json('Tidak ditemukan')
            const save = await model.income.create({
                memberId: member.id,
                month: (month) ? month : moment().format('MM'),
                year: (year) ? year : moment().format('YYYY'),
                type: (type) ? type : 'kas',
                amount
            })
            Promise.resolve(model.organization.increment('saldo', { by: amount, where: { id: 1 } }))
            return res.json(save)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    show = async (req, res) => {
        const { startDate, endDate } = req.query
        try {
            let gte = startDate, lte = endDate
            if (!startDate && !endDate) {
                gte = moment().format('YYYY-MM-01')
                lte = moment().format('YYYY-MM-DD')
            }
            const data = await model.income.findAll({
                where: {
                    createdAt: { [Op.between]: [moment(gte).startOf('day'), moment(lte).endOf('day')] }
                },
                include: [{ model: model.member, attributes: ['name'] }],
                raw: true, nest: true
            })
            let msg = '', total = 0
            data.map(el => {
                total += el.amount
                msg += `${moment(el.createdAt).format('DD-MMM-YY')}  ${this.numberFormat(el.amount)}     ${el.type}\n`
            })
            msg += `\nTotal Pemasukan *Rp. ${this.numberFormat(total)}*`
            msg += `\n\nTTD\n *Achyar Anshorie*`
            const template = `*Pemasukan PB. Embun*\n\nTgl               Nominal   Ket\n${msg}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    kas = async (req, res) => {
        let { month, year, type } = req.query
        try {
            type = (type) ? type : 'kas'
            month = (month) ? month : moment().format('MM')
            year = (year) ? year : moment().format('YYYY')
            const members = await model.member.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']], raw: true })
            const kas = await model.income.findAll({
                where: { type, month, year },
                raw: true
            })
            let result = []
            for (const member of members) {
                let amount = 0, status = false
                for (const trans of kas) {
                    if (member.id == trans.memberId) {
                        amount = trans.amount
                        status = true
                    }
                }
                result.push({
                    name: member.name,
                    amount, status
                })
            }
            let msg = ''
            result.map(el => {
                msg += `${el.name}  ${(el.status) ? '✅' : '☑️'}\n`
            })
            msg += `\n\nCatatan: \n-Ceklis Hijau Sudah Lunas\n-Ceklis Abu-abu Belum Lunas\n\nTTD\n *Achyar Anshorie*`
            const date = `${year}-${month}-01`
            const template = `Uang ${type.toUpperCase()} PB. Embun Periode *${moment(date).format('MMM')} ${year}*\n\n${msg}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    mutasi = async (req, res) => {
        const { startDate, endDate } = req.query
        try {
            let gte = startDate, lte = endDate
            if (!startDate && !endDate) {
                gte = moment().format('YYYY-MM-01')
                lte = moment().format('YYYY-MM-DD')
            }
            const income = await model.income.findAll({
                where: {
                    createdAt: { [Op.between]: [moment(gte).startOf('day'), moment(lte).endOf('day')] }
                },
                attributes: [['type', 'desc'], 'amount', [model.Sequelize.fn('DATE', model.Sequelize.col('createdAt')), 'date']],
                raw: true
            })
            const spending = await model.spending.findAll({
                where: {
                    date: { [Op.between]: [gte, lte] }
                },
                attributes: ['desc', 'amount', 'date'],
                raw: true
            })
            const saldo = await model.organization.sum('saldo') || 0
            const merge = [...income, ...spending]
            const sort = merge.sort((a, b) => new Date(a.date) - new Date(b.date))
            let msg = '', debit = 0, kredit = 0
            sort.map(el => {
                let amount
                if (el.desc == 'kas' || el.desc == 'sparing' || el.desc == 'lainnya') {
                    debit += el.amount
                    amount = '*(+)* ' + this.numberFormat(el.amount)
                } else {
                    kredit += el.amount
                    amount = '*(-)* ' + this.numberFormat(el.amount)
                }
                msg += `${moment(el.date).format('DD-MMM-YY')}  ${amount}     ${el.desc}\n`
            })
            msg += `\nTotal Pemasukan Rp. ${this.numberFormat(debit)}`
            msg += `\nTotal Pengeluaran Rp. ${this.numberFormat(kredit)}`
            msg += `\nTotal Keseluruhan *Rp. ${this.numberFormat(debit - kredit)}*`
            msg += `\n\nSaldo Saat ini *Rp. ${this.numberFormat(saldo)}*`
            msg += `\n\nTTD\n *Achyar Anshorie*`
            const template = `*Mutasi KAS PB. Embun*\n\nTgl               Nominal   Ket\n${msg}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    numberFormat = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

}
export default new IncomeController()
