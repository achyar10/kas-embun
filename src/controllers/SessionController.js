import model from '../models'

class SessionController {

    create = (req, res) => {
        const { data } = req.body
        try {
            model.session.create({ data })
                .then(response => res.json(response))
                .catch(err => res.json(err))
        } catch (error) {
            console.log(error)
            res.status(500).json('Error koneksi')
        }
    }

    show = async (req, res) => {
        try {
            const data = await model.session.findOne({ order: [['id', 'DESC']], raw: true })
            return res.json(data || {})
        } catch (error) {
            console.log(error)
            res.status(500).json('Error koneksi')
        }
    }

    remove = async (req, res) => {
        try {
            await model.session.destroy({ truncate: true, cascade: false })
            return res.json('OK')
        } catch (error) {
            console.log(error)
            res.status(500).json('Error koneksi')
        }
    }

}
export default new SessionController()