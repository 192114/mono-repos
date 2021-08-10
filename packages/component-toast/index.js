/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
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
  info: <AiOutlineInfoCircle />,
  success: <AiOutlineCheckCircle />,
  fail: <AiOutlineCloseCircle />,
  loading: <AiOutlineLoading />,
}

// 自定义动画钩子
const useTransition = () => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1)
    })
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return opacity
}

// 基础toast
const BaseToast = ({ msg, Icon }) => {
  const opacity = useTransition()
  return (
    <ToastContainer opacity={opacity}>
      <div>
        <IconContainer>{Icon}</IconContainer>
        <Text>{msg}</Text>
      </div>
    </ToastContainer>
  )
}

// loading toast
const LoadingToast = ({ msg, Icon }) => {
  const opacity = useTransition()
  return (
    <ToastContainer opacity={opacity}>
      <div>
        <IconSpinContainer>{Icon}</IconSpinContainer>
        <Text>{msg}</Text>
      </div>
    </ToastContainer>
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
  // 处理自定义图片 type 优先级最高 其次icon
  let Icon = <AiOutlineInfoCircle />
  if (options.icon) {
    Icon = options.icon
  }

  if (options.type) {
    Icon = iconTypes[options.type]
  }

  // 如果toast已经存在 则销毁后重建
  clear()

  const div = document.createElement('div')
  div.setAttribute('class', 'component-toast')
  document.body.append(div)

  let Component = BaseToast

  if (options.type === 'loading') {
    Component = LoadingToast
  }

  const HocComponent = options.forbidClick ? (
    <Mask>
      <Component msg={options.message} Icon={Icon} />
    </Mask>
  ) : (
    <Component msg={options.message} Icon={Icon} />
  )

  ReactDOM.render(HocComponent, div)

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

const show = (opts) => {
  const options = {
    ...defaultOpts,
    ...opts,
  }

  handleToastRender(options)
}

export default {
  info,
  success,
  fail,
  loading,
  clear,
  show,
}
