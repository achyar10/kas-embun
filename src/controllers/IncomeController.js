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
                type, amount
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
            return res.json(data)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    kas = async (req, res) => {
        const { month, year, type } = req.body
        try {
            const members = await model.member.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']], raw: true })
            const kas = await model.income.findAll({
                where: {
                    type: (type) ? type : 'kas',
                    month: (month) ? month : moment().format('MM'),
                    year: (year) ? year : moment().format('YYYY'),
                },
                raw: true
            })
            let result = []
            for (const member of members) {
                let amount = 0, status = 'Belum Lunas'
                for (const trans of kas) {
                    if (member.id == trans.memberId) {
                        amount = trans.amount
                        status = 'Lunas'
                    }
                }
                result.push({
                    name: member.name,
                    amount, status
                })
            }
            return res.json(result)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

}
export default new IncomeController()