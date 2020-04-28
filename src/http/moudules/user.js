import axios from '../axios'

/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/webManage/user/save',
        method: 'post',
        data
    })
}
export const findByName = (params) => {
    return axios({
        url: '/webManage/user/findByName',
        method: 'get',
        params
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/webManage/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/webManage/user/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/webManage/user/findPermissions',
        method: 'get',
        params
    })
}