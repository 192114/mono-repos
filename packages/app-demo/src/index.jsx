import React, { useEffect } from 'react'
import reactDom from 'react-dom'

import axios from '@util/request'

import Scroll from '@component/scroll'

import './index.less'

const App = () => {
  useEffect(() => {
    const getApkRes = async () => {
      const data = await axios.post('commapk/getApk.do', { test: '+++' })
      console.log(data)
    }

    getApkRes()
  }, [])

  return (
    <div className="container">
      <Scroll>
        <div>1112222</div>
      </Scroll>
    </div>
  )
}

reactDom.render(<App />, document.querySelector('#root'))
