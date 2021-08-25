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

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joolun.common.core.controller.BaseController;
import com.joolun.common.core.domain.AjaxResult;
import com.joolun.weixin.config.CommonConstants;
import com.joolun.weixin.service.WxMsgService;
import com.joolun.weixin.service.WxUserService;
import com.joolun.weixin.constant.ConfigConstant;
import com.joolun.weixin.entity.WxMsg;
import com.joolun.weixin.entity.WxMsgVO;
import com.joolun.weixin.entity.WxUser;
import io.swagger.annotations.Api;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpKefuService;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.kefu.WxMpKefuMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 微信消息
 *
 * @author www.joolun.com
 * @date 2019-05-28 16:12:10
 */
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/wxmsg")
@Api(value = "wxmsg", tags = "wxmsg管理")
public class WxMsgController extends BaseController {

    private final WxMsgService wxMsgService;
	private final WxUserService wxUserService;
	private final WxMpService wxService;

    /**
    * 分页查询
    * @param page 分页对象
    * @param wxMsgVO 微信消息
    * @return
    */
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermi('wxmp:wxmsg:index')")
    public AjaxResult getWxMsgPage(Page page, WxMsgVO wxMsgVO) {
    	if(StringUtils.isNotBlank(wxMsgVO.getNotInRepType())){
			return  AjaxResult.success(wxMsgService.listWxMsgMapGroup(page,wxMsgVO));
		}
    	if(StringUtils.isNotBlank(wxMsgVO.getWxUserId())){//标记为已读
			WxMsg wxMsg = new WxMsg();
			wxMsg.setReadFlag(CommonConstants.YES);
			Wrapper queryWrapper = Wrappers.<WxMsg>lambdaQuery()
					.eq(WxMsg::getWxUserId,wxMsgVO.getWxUserId())
					.eq(WxMsg::getReadFlag,CommonConstants.NO);
			wxMsgService.update(wxMsg,queryWrapper);
		}
    	return AjaxResult.success(wxMsgService.page(page,Wrappers.query(wxMsgVO)));
    }

    /**
    * 通过id查询微信消息
    * @param id id
    * @return R
    */
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxmsg:get')")
    public AjaxResult getById(@PathVariable("id") String id){
    	return AjaxResult.success(wxMsgService.getById(id));
    }

    /**
    * 新增微信消息
    * @param wxMsg 微信消息
    * @return R
    */
    @PostMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxmsg:add')")
    public AjaxResult save(@RequestBody WxMsg wxMsg){
		try {
			WxUser wxUser = wxUserService.getById(wxMsg.getWxUserId());
			//入库
			wxMsg.setNickName(wxUser.getNickName());
			wxMsg.setHeadimgUrl(wxUser.getHeadimgUrl());
			wxMsg.setCreateTime(LocalDateTime.now());
			wxMsg.setType(ConfigConstant.WX_MSG_TYPE_2);
			WxMpKefuMessage wxMpKefuMessage = null;
			if(WxConsts.KefuMsgType.TEXT.equals(wxMsg.getRepType())){
				wxMsg.setRepContent(wxMsg.getRepContent());
				wxMpKefuMessage = WxMpKefuMessage.TEXT().build();
				wxMpKefuMessage.setContent(wxMsg.getRepContent());
			}
			if(WxConsts.KefuMsgType.IMAGE.equals(wxMsg.getRepType())){//图片
				wxMsg.setRepName(wxMsg.getRepName());
				wxMsg.setRepUrl(wxMsg.getRepUrl());
				wxMsg.setRepMediaId(wxMsg.getRepMediaId());
				wxMpKefuMessage = WxMpKefuMessage.IMAGE().build();
				wxMpKefuMessage.setMediaId(wxMsg.getRepMediaId());
			}
			if(WxConsts.KefuMsgType.VOICE.equals(wxMsg.getRepType())){
				wxMsg.setRepName(wxMsg.getRepName());
				wxMsg.setRepUrl(wxMsg.getRepUrl());
				wxMsg.setRepMediaId(wxMsg.getRepMediaId());
				wxMpKefuMessage = WxMpKefuMessage.VOICE().build();
				wxMpKefuMessage.setMediaId(wxMsg.getRepMediaId());
			}
			if(WxConsts.KefuMsgType.VIDEO.equals(wxMsg.getRepType())){
				wxMsg.setRepName(wxMsg.getRepName());
				wxMsg.setRepDesc(wxMsg.getRepDesc());
				wxMsg.setRepUrl(wxMsg.getRepUrl());
				wxMsg.setRepMediaId(wxMsg.getRepMediaId());
				wxMpKefuMessage = WxMpKefuMessage.VIDEO().build();
				wxMpKefuMessage.setMediaId(wxMsg.getRepMediaId());
				wxMpKefuMessage.setTitle(wxMsg.getRepName());
				wxMpKefuMessage.setDescription(wxMsg.getRepDesc());
			}
			if(WxConsts.KefuMsgType.MUSIC.equals(wxMsg.getRepType())){
				wxMsg.setRepName(wxMsg.getRepName());
				wxMsg.setRepDesc(wxMsg.getRepDesc());
				wxMsg.setRepUrl(wxMsg.getRepUrl());
				wxMsg.setRepHqUrl(wxMsg.getRepHqUrl());
				wxMpKefuMessage = WxMpKefuMessage.MUSIC().build();
				wxMpKefuMessage.setTitle(wxMsg.getRepName());
				wxMpKefuMessage.setDescription(wxMsg.getRepDesc());
				wxMpKefuMessage.setMusicUrl(wxMsg.getRepUrl());
				wxMpKefuMessage.setHqMusicUrl(wxMsg.getRepHqUrl());
				wxMpKefuMessage.setThumbMediaId(wxMsg.getRepThumbMediaId());
			}
			if(WxConsts.KefuMsgType.NEWS.equals(wxMsg.getRepType())){
				List<WxMpKefuMessage.WxArticle> list = new ArrayList<>();
				JSONArray jSONArray = wxMsg.getContent().getJSONArray("articles");
				WxMpKefuMessage.WxArticle t;
				for(Object object : jSONArray){
					JSONObject jSONObject = JSONUtil.parseObj(JSONUtil.toJsonStr(object));
					t = new WxMpKefuMessage.WxArticle();
					t.setTitle(jSONObject.getStr("title"));
					t.setDescription(jSONObject.getStr("digest"));
					t.setPicUrl(jSONObject.getStr("thumbUrl"));
					t.setUrl(jSONObject.getStr("url"));
					list.add(t);
				}
				wxMsg.setRepName(wxMsg.getRepName());
				wxMsg.setRepDesc(wxMsg.getRepDesc());
				wxMsg.setRepUrl(wxMsg.getRepUrl());
				wxMsg.setRepMediaId(wxMsg.getRepMediaId());
				wxMsg.setContent(wxMsg.getContent());
				wxMpKefuMessage = WxMpKefuMessage.NEWS().build();
				wxMpKefuMessage.setArticles(list);
			}
			if(wxMpKefuMessage != null){
				WxMpKefuService wxMpKefuService = wxService.getKefuService();
				wxMpKefuMessage.setToUser(wxUser.getOpenId());
				wxMpKefuService.sendKefuMessage(wxMpKefuMessage);
				wxMsgService.save(wxMsg);
				return AjaxResult.success(wxMsg);
			}else{
				return AjaxResult.error("非法消息类型");
			}
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("新增微信消息失败"+e.getMessage());
			return AjaxResult.error(e.getMessage());
		}
    }

    /**
    * 修改微信消息
    * @param wxMsg 微信消息
    * @return R
    */
    @PutMapping
    @PreAuthorize("@ss.hasPermi('wxmp:wxmsg:edit')")
    public AjaxResult updateById(@RequestBody WxMsg wxMsg){
    	return AjaxResult.success(wxMsgService.updateById(wxMsg));
    }

    /**
    * 通过id删除微信消息
    * @param id id
    * @return R
    */
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermi('wxmp:wxmsg:del')")
    public AjaxResult removeById(@PathVariable String id){
    	return AjaxResult.success(wxMsgService.removeById(id));
    }

}
