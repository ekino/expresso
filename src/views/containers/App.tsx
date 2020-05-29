import { connect } from 'react-redux'
import App from '../components/App'

const updateApp = (data: any): any => data

const mapStateToProps = (state: any): any => ({
    data: updateApp(state.data)
})

export default connect(mapStateToProps)(App)
