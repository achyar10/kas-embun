import model from '../models'

class MemberController {

    list = async (req, res) => {
        try {
            const data = await model.member.findAll({ raw: true })
            let members = ''
            data.map((el, i) => {
                members += `${i+1}. ${el.name} - ${el.position}\n`
            })
            const template = `*List Anggota PB. Embun*\n${members}`
            return res.json(template)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    create = async (req, res) => {
        const { name, position } = req.body
        try {
            if (!name) return res.status(400).json('nama wajib diisi!')
            if (!position) return res.status(400).json('jabatan wajib diisi!')
            const save = await model.member.create({ name, position })
            return res.json(save)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    update = async (req, res) => {
        const { id } = req.body
        try {
            if (!id) return res.status(400).json('id wajib diisi!')
            const update = await model.member.update(req.body, { where: { id } })
            if (update[0] === 1) {
                return res.json('Data berhasil diupdate')
            }
            return res.status(404).json('data tidak ditemukan!')
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

    remove = async (req, res) => {
        const { id } = req.body
        try {
            if (!id) return res.status(400).json('id wajib diisi!')
            const remove = await model.member.destroy({ where: { id } })
            if (remove) {
                return res.json('Data berhasil dihapus')
            }
            return res.status(404).json('data tidak ditemukan!')
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

}
export default new MemberController()