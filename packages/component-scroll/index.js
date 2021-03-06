import React, { useEffect, useState, useRef, forwardRef, useMemo, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import BScroll from '@better-scroll/core'
import styled, { keyframes } from 'styled-components'
import { debounce } from 'lodash'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const LoadRefreshIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  font-size: 20px;
  text-align: center;
`

const LoadMoreIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: 5px;
  left: 0;
  z-index: 100;
  width: 100%;
  font-size: 20px;
  text-align: center;
`

const LoadingSvgSpan = styled.div`
  width: 20px;
  height: 20px;
  margin: 0 auto;
  animation: ${rotate} 1s linear infinite;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState(null)

  const scrollContainerRef = useRef(null)

  const { click, direction, children, bounceTop, bounceBottom, refresh, pullUpLoading, pullDownLoading } = props

  const { onScroll, pullDown, pullUp } = props

  const pullDownDebounce = useMemo(() => {
    if (!pullDown) {
      return null
    }
    return debounce(pullDown, 500)
  }, [pullDown])

  const pullUpDebounce = useMemo(() => {
    if (!pullUp) {
      return null
    }
    return debounce(pullUp, 500)
  }, [pullUp])

  // 初始化scroll
  useEffect(() => {
    const scroll = BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      click,
      probeType: 3,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
    })

    setBScroll(scroll)

    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 注册滚动事件
  useEffect(() => {
    if (!bScroll || !onScroll) {
      return null
    }

    bScroll.on('scroll', onScroll)

    return () => {
      bScroll.off('scroll', onScroll)
    }
  }, [bScroll, onScroll])

  // 下拉到顶部的事件监听
  useEffect(() => {
    if (!bScroll || !pullDown) {
      return null
    }

    const handlePullDown = (pos) => {
      // 判断用户下拉动作
      if (pos.y > 50) {
        pullDownDebounce()
      }
    }

    bScroll.on('touchEnd', handlePullDown)

    return () => {
      bScroll.off('touchEnd', handlePullDown)
    }
  }, [bScroll, pullDown, pullDownDebounce])

  // 上滑到底部加载更多
  useEffect(() => {
    if (!bScroll || !pullUp) {
      return null
    }

    const handlePullUp = () => {
      // 判断滑动到底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    }

    bScroll.on('scrollEnd', handlePullUp)

    return () => {
      bScroll.off('scrollEnd', handlePullUp)
    }
  }, [bScroll, pullUp, pullUpDebounce])

  // 组件依赖变化时 调用refresh 方法
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  // 使用 ref 时自定义暴露给父组件的实例值 与forwardRef一起使用
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
      return null
    },
  }))

  const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }

  return (
    <ScrollContainer ref={scrollContainerRef}>
      <div>
        <LoadRefreshIcon style={PullDowndisplayStyle}>
          <LoadingSvgSpan>
            <AiOutlineLoading3Quarters />
          </LoadingSvgSpan>
        </LoadRefreshIcon>

        {children}

        <LoadMoreIcon style={PullUpdisplayStyle}>
          <LoadingSvgSpan>
            <AiOutlineLoading3Quarters />
          </LoadingSvgSpan>
        </LoadMoreIcon>
      </div>
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  click: true,
  direction: 'vertical',
  children: null,
  onScroll: null, // 滚动中 执行的方法
  pullDown: null, // 下拉刷新
  pullUp: null, // 上拉加载更多
  bounceTop: true, // 顶部 回弹动画
  bounceBottom: true, // 底部 回弹动画
  refresh: true, // 是否允许 组件依赖 变化时 调用 refresh 方法
  pullUpLoading: false,
  pullDownLoading: false,
}

Scroll.propTypes = {
  click: PropTypes.bool,
  children: PropTypes.node,
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  onScroll: PropTypes.func,
  pullDown: PropTypes.func,
  pullUp: PropTypes.func,
  bounceTop: PropTypes.bool,
  bounceBottom: PropTypes.bool,
  refresh: PropTypes.bool,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
}

export default Scroll
