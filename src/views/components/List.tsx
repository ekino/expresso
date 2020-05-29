import React from 'react'
import { ListProps, ExpressoUnderlyingCall } from './definitions'
import ListItem from './ListItem'

const List = ({ items, title }: ListProps): JSX.Element | null => {
    return (
        <React.Fragment>
            <h2>{title}</h2>
            {renderJSONViews(items, title)}
        </React.Fragment>
    )
}

const renderJSONViews = (items?: ExpressoUnderlyingCall[], title?: string): any => {
    return items
        ? items.map((item: ExpressoUnderlyingCall) => (
              <ListItem item={item} key={item.id}></ListItem>
          ))
        : null
}

export default List
