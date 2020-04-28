/* 
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as log from './moudules/log'
import * as articleClassify from './moudules/articleClassify'


// 默认全部导出
export default {
    login,
    user,
    role,
    menu,
    log,
    articleClassify
}