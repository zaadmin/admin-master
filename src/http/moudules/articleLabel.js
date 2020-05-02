import axios from '../axios'

/* 
 * 标签管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/webCore/ArticleLabel/save',
        method: 'post',
        data
    })
}
export const findByName = (params) => {
    return axios({
        url: '/webCore/ArticleLabel/findByName',
        method: 'get',
        params
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/webCore/ArticleLabel/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/webCore/ArticleLabel/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/webManage/ArticleLabel/findPermissions',
        method: 'get',
        params
    })
}

// 查找标签
export const getValidDataBydiv = (params) => {
    return axios({
        url: '/webCore/ArticleLabel/getValidDataBydiv',
        method: 'get',
        params
    })
}

