import axios from '../axios'

/* 
 * 角色管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/webManage/role/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/webManage/role/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/webManage/role/findPage',
        method: 'post',
        data
    })
}
// 查询全部
export const findAll = () => {
    return axios({
        url: '/webManage/role/findAll',
        method: 'get'
    })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
    return axios({
        url: '/webManage/role/findRoleMenus',
        method: 'get',
        params
    })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
    return axios({
        url: '/webManage/role/saveRoleMenus',
        method: 'post',
        data
    })
}