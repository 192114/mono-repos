/* eslint-disable react/prop-types */
import React from 'react'
import ReactDOM from 'react-dom'
import { AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading } from 'react-icons/ai'

import { ToastContainer, IconContainer, Text, IconSpinContainer, Mask } from './style'

const defaultOpts = {
  delay: 2000,
  type: '', // 消息类型
  message: '',
  forbidClick: false, // 禁止页面点击
}

const iconTypes = {
  info: AiOutlineInfoCircle,
  success: AiOutlineCheckCircle,
  fail: AiOutlineCloseCircle,
  loading: AiOutlineLoading,
}

// 基础toast
const BaseToast = ({ msg, Icon }) => {
  return (
    <ToastContainer>
      <div>
        <IconContainer>
          <Icon />
        </IconContainer>
        <Text>{msg}</Text>
      </div>
    </ToastContainer>
  )
}

// loading toast
const LoadingToast = ({ msg, Icon }) => {
  return (
    <Mask>
      <ToastContainer>
        <div>
          <IconSpinContainer>
            <Icon />
          </IconSpinContainer>
          <Text>{msg}</Text>
        </div>
      </ToastContainer>
    </Mask>
  )
}

// 删除页面上的toast
const clear = () => {
  const dom = document.querySelectorAll('.component-toast')
  const domArr = [...dom]

  // eslint-disable-next-line no-restricted-syntax
  for (const item of domArr) {
    ReactDOM.unmountComponentAtNode(item)
    item.remove()
  }
}

// render方法
const handleToastRender = (options) => {
  const Icon = iconTypes[options.type]

  // 如果toast已经存在 则销毁后重建
  clear()

  const div = document.createElement('div')
  div.setAttribute('class', 'component-toast')
  document.body.append(div)

  if (options.type === 'loading') {
    ReactDOM.render(<LoadingToast msg={options.message} Icon={() => <Icon />} />, div)
  } else {
    ReactDOM.render(<BaseToast msg={options.message} Icon={() => <Icon />} />, div)
  }

  // 如果delay=0则不消失
  if (options.delay !== 0) {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(div)
      div.remove()
    }, options.delay)
  }
}

const info = (message = '', delay = 2000) => {
  const options = {
    ...defaultOpts,
    type: 'info',
    message,
    delay,
  }
  handleToastRender(options)
}

const success = (message = '', delay = 2000) => {
  const options = {
    ...defaultOpts,
    type: 'success',
    message,
    delay,
  }
  handleToastRender(options)
}

const fail = (message = '', delay = 2000) => {
  const options = {
    ...defaultOpts,
    type: 'fail',
    message,
    delay,
  }
  handleToastRender(options)
}

const loading = (opts) => {
  const options = {
    ...defaultOpts,
    ...opts,
    type: 'loading',
    forbidClick: true,
  }
  handleToastRender(options)
}

export default {
  info,
  success,
  fail,
  loading,
  clear,
}
