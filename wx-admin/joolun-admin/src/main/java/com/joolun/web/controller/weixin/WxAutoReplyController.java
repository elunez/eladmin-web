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

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joolun.common.core.controller.BaseController;
import com.joolun.common.core.domain.AjaxResult;
import com.joolun.weixin.service.WxAutoReplyService;
import com.joolun.weixin.constant.ConfigConstant;
import com.joolun.weixin.entity.WxAutoReply;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 消息自动回复
 *
 * @author www.joolun.com
 * @date 2019-04-18 15:40:39
 */
@RestController
@AllArgsConstructor
@RequestMapping("/wxautoreply")
public class WxAutoReplyController extends BaseController {

    private final WxAutoReplyService wxAutoReplyService;

    /**
    * 分页查询
    * @param page 分页对象
    * @param wxAutoReply 消息自动回复
    * @return
    */
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermi('wxmp:wxautoreply:index')")
    public AjaxResult getWxAutoReplyPage(Page page, WxAutoReply wxAutoReply) {
    	return AjaxResult.success(wxAutoReplyService.page(page,Wrappers.query(wxAutoReply)));
    }


    /**
    * 通过id查询消息自动回复
    * @param id id
    * @return R
    */
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxautoreply:get')")
    public AjaxResult getById(@PathVariable("id") String id){
    return AjaxResult.success(wxAutoReplyService.getById(id));
    }

    /**
    * 新增消息自动回复
    * @param wxAutoReply 消息自动回复
    * @return R
    */
    @PostMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxautoreply:add')")
    public AjaxResult save(@RequestBody WxAutoReply wxAutoReply){
		this.jude(wxAutoReply);
    	return AjaxResult.success(wxAutoReplyService.save(wxAutoReply));
    }

    /**
    * 修改消息自动回复
    * @param wxAutoReply 消息自动回复
    * @return R
    */
    @PutMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxautoreply:edit')")
    public AjaxResult updateById(@RequestBody WxAutoReply wxAutoReply){
		this.jude(wxAutoReply);
    	return AjaxResult.success(wxAutoReplyService.updateById(wxAutoReply));
    }

    /**
    * 通过id删除消息自动回复
    * @param id id
    * @return R
    */
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxautoreply:del')")
    public AjaxResult removeById(@PathVariable String id){
    return AjaxResult.success(wxAutoReplyService.removeById(id));
    }

	/**
	 * //校验参数
	 * @param wxAutoReply
	 */
	public void jude(WxAutoReply wxAutoReply){
		if(ConfigConstant.WX_AUTO_REPLY_TYPE_2.equals(wxAutoReply.getType())){
			Wrapper<WxAutoReply> queryWrapper = Wrappers.<WxAutoReply>lambdaQuery()
					.eq(WxAutoReply::getReqType,wxAutoReply.getReqType());
			List<WxAutoReply> list = wxAutoReplyService.list(queryWrapper);
			if(StringUtils.isNotBlank(wxAutoReply.getId())){
				if(list != null && list.size() == 1){
					if(!list.get(0).getId().equals(wxAutoReply.getId())){
						throw new RuntimeException("请求消息类型重复");
					}
				}
				if(list != null && list.size()>1){
					throw new RuntimeException("请求消息类型重复");
				}
			}
		}
		if(ConfigConstant.WX_AUTO_REPLY_TYPE_3.equals(wxAutoReply.getType())){
			Wrapper<WxAutoReply> queryWrapper = Wrappers.<WxAutoReply>lambdaQuery()
					.eq(WxAutoReply::getReqKey,wxAutoReply.getReqKey())
					.eq(WxAutoReply::getRepType,wxAutoReply.getRepMate());
			List<WxAutoReply> list = wxAutoReplyService.list(queryWrapper);
			if(list != null && list.size() == 1){
				if(!list.get(0).getId().equals(wxAutoReply.getId())){
					throw new RuntimeException("关键词重复");
				}
			}
			if(list != null && list.size()>1){
				throw new RuntimeException("关键词重复");
			}
		}
	}
}
