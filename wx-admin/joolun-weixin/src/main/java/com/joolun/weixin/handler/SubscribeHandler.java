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
package com.joolun.weixin.handler;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.joolun.weixin.constant.ConfigConstant;
import com.joolun.weixin.entity.WxAutoReply;
import com.joolun.weixin.entity.WxUser;
import com.joolun.weixin.mapper.WxUserMapper;
import com.joolun.weixin.service.WxAutoReplyService;
import com.joolun.weixin.service.WxMsgService;
import com.joolun.weixin.utils.LocalDateTimeUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author www.joolun.com
 */
@Slf4j
@Component
@AllArgsConstructor
public class SubscribeHandler extends AbstractHandler {
    private final WxAutoReplyService wxAutoReplyService;
    private final WxUserMapper wxUserMapper;
    private final WxMsgService wxMsgService;
    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMessage,
                                    Map<String, Object> context, WxMpService weixinService,
                                    WxSessionManager sessionManager) {
        log.info("新关注用户 OPENID: " + wxMessage.getFromUser());
        // 获取微信用户基本信息
        try {
            WxMpUser userWxInfo = weixinService.getUserService()
                    .userInfo(wxMessage.getFromUser(), null);
            if (userWxInfo != null) {
                // TODO 添加关注用户到本地数据库
                WxUser wxUser = wxUserMapper.selectOne(Wrappers.<WxUser>lambdaQuery()
                        .eq(WxUser::getOpenId,userWxInfo.getOpenId()));
                if(wxUser==null){//第一次关注
                    wxUser = new WxUser();
                    wxUser.setSubscribeNum(1);
                    this.setWxUserValue(wxUser,userWxInfo);
//						wxUser.setTenantId(wxApp.getTenantId());
                    wxUserMapper.insert(wxUser);
                }else{//曾经关注过
                    wxUser.setSubscribeNum(wxUser.getSubscribeNum()+1);
                    this.setWxUserValue(wxUser,userWxInfo);
//						wxUser.setTenantId(wxApp.getTenantId());
                    wxUserMapper.updateById(wxUser);
                }
                //发送关注消息
                List<WxAutoReply> listWxAutoReply = wxAutoReplyService.list(Wrappers.<WxAutoReply>query()
                        .lambda().eq(WxAutoReply::getType,ConfigConstant.WX_AUTO_REPLY_TYPE_1));
                WxMpXmlOutMessage wxMpXmlOutMessage = MsgHandler.getWxMpXmlOutMessage(wxMessage,listWxAutoReply,wxUser,wxMsgService);
                return wxMpXmlOutMessage;
            }
        } catch (Exception e) {
            log.error("用户关注出错："+e.getMessage());
        }
        return null;
    }

    public static void setWxUserValue(WxUser wxUser,WxMpUser userWxInfo){
        wxUser.setAppType(ConfigConstant.WX_APP_TYPE_2);;
        wxUser.setSubscribe(ConfigConstant.SUBSCRIBE_TYPE_YES);
        wxUser.setSubscribeScene(userWxInfo.getSubscribeScene());
        wxUser.setSubscribeTime(LocalDateTimeUtils.timestamToDatetime(userWxInfo.getSubscribeTime()*1000));
        wxUser.setOpenId(userWxInfo.getOpenId());
        wxUser.setNickName(userWxInfo.getNickname());
        wxUser.setSex(String.valueOf(userWxInfo.getSex()));
        wxUser.setCity(userWxInfo.getCity());
        wxUser.setCountry(userWxInfo.getCountry());
        wxUser.setProvince(userWxInfo.getProvince());
        wxUser.setLanguage(userWxInfo.getLanguage());
        wxUser.setRemark(userWxInfo.getRemark());
        wxUser.setHeadimgUrl(userWxInfo.getHeadImgUrl());
        wxUser.setUnionId(userWxInfo.getUnionId());
        wxUser.setGroupId(JSONUtil.toJsonStr(userWxInfo.getGroupId()));
        wxUser.setTagidList(userWxInfo.getTagIds());
        wxUser.setQrSceneStr(userWxInfo.getQrSceneStr());
    }

}
