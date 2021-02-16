import model from '../models'
import moment from 'moment'

class PresentController {

    create = async (req, res) => {
        try {
            const { name } = req.body
            const check = await model.member.findOne({ where: { name }, raw: true })
            if (!check) return res.status(404).json('nama tidak ditemukan')
            const present = await model.present.findOne({ where: { memberId: check.id, date: moment().format('YYYY-MM-DD') }, raw: true })
            if (present) return res.json('kan lu udah absen tadi, hmm..')
            await model.present.create({ memberId: check.id, date: moment().format('YYYY-MM-DD') })
            return res.json('Selamat datang ' + check.name)
        } catch (error) {
            console.log(error)
            res.status(500).json('error koneksi')
        }
    }

    show = async (req, res) => {
        let { date } = req.query
        moment.locale('id')
        try {
            if (!date) {
                date = moment().format('YYYY-MM-DD')
            }
            const data = await model.present.findAll({
                where: { date },
                include: [{ model: model.member, attributes: ['name'] }],
                order: [['id', 'ASC']],
                raw: true, nest: true
            })
            let msg = ''
            data.map((el, i) => {
                msg += `${i + 1}. ${el.member.name} - ${moment(el.createdAt).format('HH:mm')}, ${moment(el.createdAt).fromNow()}\n`
            })
            const template = `*Kehadiran Anggota PB. Embun*\nTanggal : ${moment(date).format('LL')}\n\n${msg}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }



}
export default new PresentController()
