import model from '../models'
import moment from 'moment'

class PresentController {

    create = async (req, res) => {
        try {
            const { name } = req.body
            const check = await model.member.findOne({ where: { name }, raw: true })
            if (!check) return res.status(404).json('tidak ditemukan')
            const present = await model.present.findOne({ where: { memberId: check.id, date: moment().format('YYYY-MM-DD') }, raw: true })
            if (present) return res.json('lu udah absen tadi')
            await model.present.create({ memberId: check.id, date: moment().format('YYYY-MM-DD') })
            return res.json(check.name + ' berhasil absen')
        } catch (error) {
            console.log(error)
            res.status(500).json('error koneksi')
        }
    }



}
export default new PresentController()
