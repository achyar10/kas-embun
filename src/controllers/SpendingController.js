import model from '../models'
import { Op } from 'sequelize'
import moment from 'moment'

class SpendingController {

    create = async (req, res) => {
        const { date, amount, desc } = req.body
        try {
            if (!amount) return res.status(400).json('nominal wajib diisi!')
            if (!desc) return res.status(400).json('desc wajib diisi!')
            const save = await model.spending.create({
                date: (date) ? date : moment().format('YYYY-MM-DD'),
                amount, desc
            })
            Promise.resolve(model.organization.decrement('saldo', { by: amount, where: { id: 1 } }))
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
            const data = await model.spending.findAll({
                where: {
                    date: { [Op.between]: [gte, lte] }
                },
                order: [['date', 'ASC']],
                raw: true
            })
            let msg = '', total = 0
            data.map(el => {
                total += el.amount
                msg += `${moment(el.date).format('DD-MMM-YY')}  ${this.numberFormat(el.amount)}     ${el.desc}\n`
            })
            msg += `\nTotal Pengeluaran *Rp. ${this.numberFormat(total)}*`
            msg += `\n\nTTD\n *Achyar Anshorie*`
            const template = `*Pengeluaran PB. Embun*\n\nTgl               Nominal   Ket\n${msg}`
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
export default new SpendingController()