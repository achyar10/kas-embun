import { Router } from 'express'
import IncomeController from '../controllers/IncomeController'
import MemberController from '../controllers/MemberController'
import OrganizationController from '../controllers/OrganizationController'
import PresentController from '../controllers/PresentController'
import RelationController from '../controllers/RelationController'
import SessionController from '../controllers/SessionController'
import SpendingController from '../controllers/SpendingController'


class Routers {

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {

        // Member
        this.router.get('/member', MemberController.list)
        this.router.post('/member', MemberController.create)
        this.router.put('/member', MemberController.update)
        this.router.delete('/member', MemberController.remove)

        // Spending
        this.router.get('/spending', SpendingController.show)
        this.router.post('/spending', SpendingController.create)

        // Income
        this.router.get('/income', IncomeController.show)
        this.router.post('/income', IncomeController.create)
        this.router.get('/kas', IncomeController.kas)

        // Organization
        this.router.get('/saldo', OrganizationController.saldo)

        // Session
        this.router.get('/session', SessionController.show)
        this.router.post('/session', SessionController.create)
        this.router.delete('/session', SessionController.remove)

        // Relation
        this.router.get('/relation', RelationController.show)
        this.router.post('/relation', RelationController.create)

        // Present
        this.router.get('/present', PresentController.show)
        this.router.post('/present', PresentController.create)
        

    }


}
export default new Routers().router