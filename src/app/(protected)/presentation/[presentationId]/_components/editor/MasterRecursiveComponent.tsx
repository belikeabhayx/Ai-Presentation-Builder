import React from 'react'

type Props = {}

const MasterRecursiveComponent = (props: Props) => {
  return (
    <div>MasterRecursiveComponent</div>
  )
}

export default MasterRecursiveComponent[
    {
        name: 'header',
    }
    {
        name: 'col',
        content: [{
            name: 'col',
            content: []
        }{
            name: 'header'
        }]
    }
]