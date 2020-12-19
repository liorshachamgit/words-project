import app from "./config/app"
import * as dotenv from "dotenv"
import * as sourceMaps from 'source-map-support'

dotenv.config()
sourceMaps.install()

if (!process.env.PORT) {
    process.exit(1)
}

const PORT : number = parseInt(process.env.PORT as string)

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT)
})

