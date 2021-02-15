import model from '../models'

class OrganizationController {

    saldo = async (req, res) => {
        try {
            const data = await model.organization.findOne({ where: { id: 1 }, raw: true })
            const template = `Sisa Saldo Kas PB. Embun *Rp. ${this.numberFormat(data.saldo) || 0}*`
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
export default new OrganizationController()