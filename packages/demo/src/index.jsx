import React, { useEffect } from 'react'
import reactDom from 'react-dom'

import axios from '@util/request'

const App = () => {
  useEffect(() => {
    axios.post('commapk/getApk.do')
  }, [])

  return <div>test app</div>
}

reactDom.render(<App />, document.querySelector('#root'))
