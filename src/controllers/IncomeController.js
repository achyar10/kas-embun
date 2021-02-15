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
                msg += `${moment(el.date).format('DD-MMM-YY')}  ${this.numberFormat(el.amount)}     ${el.type}\n`
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
            msg += `\n\nTTD\n *Achyar Anshorie*`
            const date = `${year}-${month}-01`
            const template = `Uang ${type.toUpperCase()} PB. Embun Periode *${moment(date).format('MMM')} ${year}*\n\n${msg}`
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