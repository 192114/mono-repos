import React, { useEffect } from 'react'
import reactDom from 'react-dom'

import axios from '@util/request'

const App = () => {
  useEffect(() => {
    const getApkRes = async () => {
      const data = await axios.post('commapk/getApk.do', { test: '+++' })
      console.log(data)
    }

    getApkRes()
  }, [])

  return <div>test app</div>
}

reactDom.render(<App />, document.querySelector('#root'))
