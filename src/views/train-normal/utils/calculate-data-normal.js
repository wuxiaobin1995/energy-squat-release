/*
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-10-24 16:18:37
 * @Description : 数据计算方法
 */
import moment from 'moment'

/**
 * @description: 向上运动
 * @param {Array} angleArray 角度[°]
 * @param {Array} angularVelocityArray 角速度[rad/s]
 * @param {Number} trainWeight 传感器所在点的负重[kg]
 * @return: {Object}
 */
export function calculateData(
  angleArray,
  angularVelocityArray,
  trainWeight = 1
) {
  /* 该次数据记录的时间[s] */
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

  /* 相对角度值[°] */
  const relativeAngle = parseInt(
    Math.abs(
      Math.max.apply(null, angleArray) - Math.min.apply(null, angleArray)
    )
  )

  /* 峰值功率[W] */
  const powerDataArray = [] // 瞬时功率数组
  let power = 0
  for (let i = 0; i < angleArray.length; i++) {
    if (Math.cos((Math.PI * (angleArray[i] - 180)) / 180) < 0) {
      power = 0
    } else {
      power = parseFloat(
        (
          (trainWeight * 10 * 0.73 * angularVelocityArray[i] * 0.1) /
          Math.cos((Math.PI * (angleArray[i] - 180)) / 180)
        ).toFixed(0)
      )
    }
    powerDataArray.push(power)
  }
  const maxPower = Math.max.apply(null, powerDataArray)

  /* 平均功率[W] */
  let averagePower = 0
  if (powerDataArray.length === 0) {
    averagePower = 0
  } else {
    let sumPower = 0
    powerDataArray.forEach(v => {
      sumPower += v
    })
    averagePower = parseFloat((sumPower / powerDataArray.length).toFixed(1))
  }

  /* 峰值角速度[rad/s] */
  const maxAngularVelocity = parseFloat(
    Math.max.apply(null, angularVelocityArray).toFixed(1)
  )

  /* 平均角速度[rad/s] */
  let averageAngularVelocity = 0
  if (angleArray.length === 0) {
    averageAngularVelocity = 0
  } else {
    let sumAngularVelocity = 0
    angularVelocityArray.forEach(v => {
      sumAngularVelocity += v
    })
    averageAngularVelocity = parseFloat(
      (sumAngularVelocity / angularVelocityArray.length).toFixed(1)
    )
  }

  /* 返回计算结果 */
  return {
    currentTime,
    relativeAngle,
    maxPower,
    averagePower,
    powerDataArray,
    maxAngularVelocity,
    averageAngularVelocity
  }
}
