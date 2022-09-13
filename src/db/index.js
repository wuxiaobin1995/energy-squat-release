/*
 * @Author      : 吴晓斌
 * @Date        : 2020-10-16 11:21:24
 * @LastEditTime: 2020-10-21 14:35:48
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('End_Squat_Release')
  db.version(1).stores({
    // 用户表
    user: 'userId,userGroup,birthday,sex',
    // 训练动作表
    action: 'actionId',
    // 训练数据记录表
    train_data:
      '++,userId,actionId,userGroup,currentTime,relativeAngle,trainWeight,mode,[userGroup+userId+currentTime]'
  })
  return db
}
