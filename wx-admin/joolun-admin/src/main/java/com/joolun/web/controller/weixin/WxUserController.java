/*
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
package com.joolun.web.controller.weixin;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joolun.common.core.controller.BaseController;
import com.joolun.common.core.domain.AjaxResult;
import com.joolun.weixin.service.WxUserService;
import com.joolun.weixin.entity.WxUser;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 微信用户
 *
 * @author www.joolun.com
 * @date 2019-03-25 15:39:39
 */
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/wxuser")
public class WxUserController extends BaseController {

    private final WxUserService wxUserService;

    /**
     * 分页查询
     *
     * @param page   分页对象
     * @param wxUser 微信用户
     * @return
     */
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:index')")
    public AjaxResult getWxUserPage(Page page, WxUser wxUser, String tagId) {
        Wrapper<WxUser> queryWrapper;
        if (StringUtils.isNotBlank(tagId)) {
            queryWrapper = Wrappers.lambdaQuery(wxUser)
                    .and(wrapper -> wrapper
                            .eq(WxUser::getTagidList, "[" + tagId + "]")
                            .or()
                            .like(WxUser::getTagidList, "," + tagId + ",")
                            .or()
                            .likeRight(WxUser::getTagidList, "[" + tagId + ",")
                            .or()
                            .likeLeft(WxUser::getTagidList, "," + tagId + "]"));
        } else if (StrUtil.isNotBlank(wxUser.getNickName())) {
            String nickName = wxUser.getNickName();
            wxUser.setNickName(null);
            queryWrapper = Wrappers.lambdaQuery(wxUser)
                    .like(WxUser::getNickName, nickName);
        } else {
            queryWrapper = Wrappers.lambdaQuery(wxUser);
        }
        return AjaxResult.success(wxUserService.page(page, queryWrapper));
    }


    /**
     * 通过id查询微信用户
     *
     * @param id id
     * @return R
     */
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:get')")
    public AjaxResult getById(@PathVariable("id") String id) {
        return AjaxResult.success(wxUserService.getById(id));
    }

    /**
     * 新增微信用户
     *
     * @param wxUser 微信用户
     * @return R
     */
    @PostMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:add')")
    public AjaxResult save(@RequestBody WxUser wxUser) {
        return AjaxResult.success(wxUserService.save(wxUser));
    }

    /**
     * 修改微信用户
     *
     * @param wxUser 微信用户
     * @return R
     */
    @PutMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:edit')")
    public AjaxResult updateById(@RequestBody WxUser wxUser) {
        return AjaxResult.success(wxUserService.updateById(wxUser));
    }

    /**
     * 通过id删除微信用户
     *
     * @param id id
     * @return R
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:del')")
    public AjaxResult removeById(@PathVariable String id) {
        return AjaxResult.success(wxUserService.removeById(id));
    }

    @PostMapping("/synchron")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:synchro')")
    public AjaxResult synchron() {
        try {
            wxUserService.synchroWxUser();
            return AjaxResult.success();
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("同步微信用户失败", e);
            return AjaxResult.error(e.getMessage());
        }
    }

    /**
     * 修改微信用户备注
     *
     * @param wxUser
     * @return
     */
    @PutMapping("/remark")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:edit:remark')")
    public AjaxResult remark(@RequestBody WxUser wxUser) {
        try {
            return AjaxResult.success(wxUserService.updateRemark(wxUser));
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("修改微信用户备注失败", e);
            return AjaxResult.error(e.getMessage());
        }
    }

    /**
     * 打标签
     *
     * @param data
     * @return
     */
    @PutMapping("/tagid-list")
    @PreAuthorize("@ss.hasPermi('wxmp:wxuser:tagging')")
    public AjaxResult tagidList(@RequestBody JSONObject data) {
        try {
            String appId = data.getStr("appId");
            String taggingType = data.getStr("taggingType");
            JSONArray tagIdsArray = data.getJSONArray("tagIds");
            JSONArray openIdsArray = data.getJSONArray("openIds");
            String[] openIds = openIdsArray.toArray(new String[0]);
            for (Object tagId : tagIdsArray) {
                wxUserService.tagging(taggingType, Long.valueOf(String.valueOf(tagId)), openIds);
            }
            return AjaxResult.success();
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("修改微信用户备注失败", e);
            return AjaxResult.error(e.getMessage());
        }
    }

}
