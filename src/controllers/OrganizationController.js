import model from '../models'

class OrganizationController {

    saldo = async (req, res) => {
        try {
            const data = await model.organization.findOne({ where: { id: 1 }, raw: true })
            return res.json({ saldo: data.saldo || 0 })
        } catch (error) {
            console.log(error)
            return res.status(500).json('Error koneksi')
        }
    }

}
export default new OrganizationController()