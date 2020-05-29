import React from 'react'
import { AppProps } from './definitions'
import List from './List'
import ListItem from './ListItem'

const App = ({ data }: AppProps): JSX.Element => (
    <React.Fragment>
        {<ListItem title="Original call" item={data?.originalCall}></ListItem>}
        {<List title="Underlying calls" items={data?.underlyingCalls}></List>}
    </React.Fragment>
)

export default App
