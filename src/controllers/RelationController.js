import model from '../models'

class RelationController {

    create = async (req, res) => {
        const { nameOne, nameTwo } = req.body
        try {
            const check1 = await model.member.findOne({ where: { name: nameOne }, raw: true })
            if (!check1) return res.json('Nama tidak dikenali')
            const check2 = await model.member.findOne({ where: { name: nameTwo }, raw: true })
            if (!check2) return res.json('Nama tidak dikenali')
            await model.relation.create({
                member1Id: check1.id,
                member2Id: check2.id
            })
            return res.json('Data berhasil ditambahkan')
        } catch (error) {
            console.log(error)
            res.status(500).json('error koneksi')
        }
    }

    show = async (req, res) => {
        try {
            const data = await model.relation.findAll({
                attributes: ['id'],
                include: [{ model: model.member, as: 'member1', attributes: ['name'] }, { model: model.member, as: 'member2', attributes: ['name'] }],
                order: [['id', 'ASC']],
                raw: true, nest: true
            })
            let msg = ''
            data.map((el, i) => {
                msg += `${i + 1}. ${el.member1.name} - ${el.member2.name}\n`
            })
            const template = `*Daftar Pasangan PB. Embun*\n${msg}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

}
export default new RelationController()