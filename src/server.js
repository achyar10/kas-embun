import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import router from './routers'
import { config as dotenv } from 'dotenv'
import model from './models'

class Server {

    constructor() {
        this.app = express()
        this.plugins()
        this.routes()
        dotenv()
    }

    plugins() {
        this.app.enable('trust proxy')
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(morgan('combined'))
        morgan.token('date', function () {
            let p = new Date().toString().replace(/[A-Z]{3}\+/, '+').split(/ /);
            return (p[2] + '/' + p[1] + '/' + p[3] + ':' + p[4] + ' ' + p[5]);
        });
        this.app.use(bodyParser.json({ limit: '50mb' }))
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    }

    routes() {
        this.app.use('/', router)
        this.app.get('/', (req, res) => {
            res.send('Hello, Its Works')
        })
        this.app.use((req, res) => {
            res.send('Page not found!')
        })
    }

}

dotenv()
const port = process.env.PORT || 3000
const app = new Server().app
app.listen(port, async () => {
    await model.sequelize.sync({ force: false, alter: true })
    const check = await model.organization.findOne({ where: { id: 1 } })
    if (!check) {
        await model.organization.create({ name: 'PB. Embun' })
    }
    console.log(`Server running on http://localhost:${port}`)
})