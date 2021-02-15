import model from '../models'
import { Op } from 'sequelize'
import moment from 'moment'

class SpendingController {

    create = async (req, res) => {
        const { date, amount, desc } = req.body
        try {
            if (!date) return res.status(400).json('tanggal wajib diisi!')
            if (!amount) return res.status(400).json('nominal wajib diisi!')
            if (!desc) return res.status(400).json('desc wajib diisi!')
            const save = await model.spending.create({ date, amount, desc })
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
                raw: true
            })
            return res.json(data)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

}
export default new SpendingController()