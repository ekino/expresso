import React, { useEffect } from 'react'
import { ListItemProps, ExpressoUnderlyingCall, ExpressoCall } from './definitions'

const ListItem = ({ title, item }: ListItemProps): JSX.Element | null => {
    const [isClient, setIsClient] = React.useState(false)
    useEffect(() => {
        setIsClient(window !== undefined)
    })
    return isClient && item ? (
        <React.Fragment>
            <h2>{title}</h2>
            {renderReactJson(item)}
        </React.Fragment>
    ) : null
}

const renderReactJson = (item: ExpressoUnderlyingCall | ExpressoCall): JSX.Element => {
    const ReactJson = require('react-json-view').default
    return <ReactJson src={item} collapsed />
}

export default ListItem
