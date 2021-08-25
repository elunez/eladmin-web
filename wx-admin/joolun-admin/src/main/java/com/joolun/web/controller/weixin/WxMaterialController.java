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
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joolun.common.core.controller.BaseController;
import com.joolun.common.core.domain.AjaxResult;
import com.joolun.weixin.entity.ImageManager;
import com.joolun.weixin.utils.FileUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpMaterialService;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.material.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 微信素材
 *
 * @author www.joolun.com
 * @date 2019-03-23 21:26:35
 */
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/wxmaterial")
public class WxMaterialController extends BaseController {

	private final WxMpService wxService;

	/**
	 * 上传非图文微信素材
	 * @param mulFile
	 * @param mediaType
	 * @return
	 */
	@PostMapping("/materialFileUpload")
	//	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:add')")
	public AjaxResult materialFileUpload(@RequestParam("file") MultipartFile mulFile,
										 @RequestParam("title") String title,
										 @RequestParam("introduction") String introduction,
										 @RequestParam("mediaType") String mediaType) {
		try {
			WxMpMaterial material = new WxMpMaterial();
			material.setName(mulFile.getOriginalFilename());
			if(WxConsts.MediaFileType.VIDEO.equals(mediaType)){
				material.setVideoTitle(title);
				material.setVideoIntroduction(introduction);
			}
			File file = FileUtils.multipartFileToFile(mulFile);
			material.setFile(file);
			WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
			WxMpMaterialUploadResult wxMpMaterialUploadResult = wxMpMaterialService.materialFileUpload(mediaType,material);
			WxMpMaterialFileBatchGetResult.WxMaterialFileBatchGetNewsItem wxMpMaterialFileBatchGetResult = new WxMpMaterialFileBatchGetResult.WxMaterialFileBatchGetNewsItem();
			wxMpMaterialFileBatchGetResult.setName(file.getName());
			wxMpMaterialFileBatchGetResult.setMediaId(wxMpMaterialUploadResult.getMediaId());
			wxMpMaterialFileBatchGetResult.setUrl(wxMpMaterialUploadResult.getUrl());
			return AjaxResult.success(wxMpMaterialFileBatchGetResult);
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("上传非图文微信素材失败" + e);
			return AjaxResult.error(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("上传失败", e);
			return AjaxResult.error(e.getLocalizedMessage());
		}
	}

	/**
	 * 新增图文消息
	 * @param data
	 * @return
	 */
	@PostMapping("/materialNews")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:add')")
	public AjaxResult materialNewsUpload(@RequestBody JSONObject data) {
		try {
			JSONArray jSONArray = data.getJSONArray("articles");
			List<WxMpMaterialNews.WxMpMaterialNewsArticle> articles = jSONArray.toList(WxMpMaterialNews.WxMpMaterialNewsArticle.class);
			WxMpMaterialNews news = new WxMpMaterialNews();
			news.setArticles(articles);
			WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
			WxMpMaterialUploadResult wxMpMaterialUploadResult = wxMpMaterialService.materialNewsUpload(news);
			return AjaxResult.success(wxMpMaterialUploadResult);
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("新增图文失败" + e.getMessage());
			return AjaxResult.error(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("新增图文失败", e);
			return AjaxResult.error(e.getLocalizedMessage());
		}
	}

	/**
	 *修改图文消息
	 * @param data
	 * @return
	 */
	@PutMapping("/materialNews")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:edit')")
	public AjaxResult materialNewsUpdate(@RequestBody JSONObject data) {
		try {
			String mediaId = data.getStr("mediaId");
			JSONArray jSONArray = data.getJSONArray("articles");
			List<WxMpMaterialNews.WxMpMaterialNewsArticle> articles = jSONArray.toList(WxMpMaterialNews.WxMpMaterialNewsArticle.class);
			WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
			WxMpMaterialArticleUpdate wxMpMaterialArticleUpdate = new WxMpMaterialArticleUpdate();
			wxMpMaterialArticleUpdate.setMediaId(mediaId);
			int index = 0;
			for(WxMpMaterialNews.WxMpMaterialNewsArticle article : articles){
				wxMpMaterialArticleUpdate.setIndex(index);
				wxMpMaterialArticleUpdate.setArticles(article);
				wxMpMaterialService.materialNewsUpdate(wxMpMaterialArticleUpdate);
				index++;
			}
			return AjaxResult.success();
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("修改图文失败" + e);
			return AjaxResult.error(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("修改图文失败", e);
			return AjaxResult.error(e.getLocalizedMessage());
		}
	}

	/**
	 * 上传图文消息内的图片获取URL
	 * @param mulFile
	 * @return
	 */
	@PostMapping("/newsImgUpload")
	//	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:add')")
	public String newsImgUpload(@RequestParam("file") MultipartFile mulFile) throws Exception {
		File file = FileUtils.multipartFileToFile(mulFile);
		WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
		WxMediaImgUploadResult wxMediaImgUploadResult = wxMpMaterialService.mediaImgUpload(file);
		Map<Object, Object> responseData = new HashMap<>();
		responseData.put("link", wxMediaImgUploadResult.getUrl());
		return JSONUtil.toJsonStr(responseData);
	}

	/**
	 * 通过id删除微信素材
	 * @param
	 * @return R
	 */
	@DeleteMapping
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:del')")
	public AjaxResult materialDel(String id){
		WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
		try {
			return  AjaxResult.success(wxMpMaterialService.materialDelete(id));
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("删除微信素材失败", e);
			return AjaxResult.error(e.getMessage());
		}
	}

	/**
	* 分页查询
	* @param page 分页对象
	* @param type
	* @return
	*/
	@GetMapping("/page")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:index')")
	public AjaxResult getWxMaterialPage(Page page, String type) {
		try {
		  WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
		  int count = (int)page.getSize();
		  int offset = (int)page.getCurrent()*count-count;
		  if(WxConsts.MaterialType.NEWS.equals(type)){
			  return  AjaxResult.success(wxMpMaterialService.materialNewsBatchGet(offset,count));
		  }else{
			  return  AjaxResult.success(wxMpMaterialService.materialFileBatchGet(type,offset,count));
		  }
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("查询素材失败", e);
			return AjaxResult.error(e.getMessage());
		}
	}

	/**
	 * 分页查询2
	 * @param type
	 * @return
	 */
	@GetMapping("/page-manager")
//	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:index')")
	public String getWxMaterialPageManager(Integer count, Integer offset, String type) throws WxErrorException {
		List<ImageManager> listImageManager = new ArrayList<>();
		WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
		List<WxMpMaterialFileBatchGetResult.WxMaterialFileBatchGetNewsItem> list = wxMpMaterialService.materialFileBatchGet(type,offset,count).getItems();
		list.forEach(wxMaterialFileBatchGetNewsItem -> {
			ImageManager imageManager = new ImageManager();
			imageManager.setName(wxMaterialFileBatchGetNewsItem.getMediaId());
			imageManager.setUrl(wxMaterialFileBatchGetNewsItem.getUrl());
			imageManager.setThumb(wxMaterialFileBatchGetNewsItem.getUrl());
			listImageManager.add(imageManager);
		});
		return JSONUtil.toJsonStr(listImageManager);
	}

	/**
	* 获取微信视频素材
	* @param
	* @return R
	*/
	@GetMapping("/materialVideo")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:get')")
	public AjaxResult getMaterialVideo(String mediaId){
	  WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
	  try {
		  return  AjaxResult.success(wxMpMaterialService.materialVideoInfo(mediaId));
	  } catch (WxErrorException e) {
		  e.printStackTrace();
		  log.error("获取微信视频素材失败", e);
		  return AjaxResult.error(e.getMessage());
	  }
	}

	/**
	 * 获取微信素材直接文件
	 * @param
	 * @return R
	 */
	@GetMapping("/materialOther")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmaterial:get')")
	public ResponseEntity<byte[]> getMaterialOther(String mediaId, String fileName) throws Exception {
		try {
			WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
			//获取文件
			InputStream is = wxMpMaterialService.materialImageOrVoiceDownload(mediaId);
			byte[] body = new byte[is.available()];
			is.read(body);
			HttpHeaders headers = new HttpHeaders();
			//设置文件类型
			headers.add("Content-Disposition", "attchement;filename=" +  URLEncoder.encode(fileName, "UTF-8"));
			headers.add("Content-Type", "application/octet-stream");
			HttpStatus statusCode = HttpStatus.OK;
			//返回数据
			ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(body, headers, statusCode);
			return entity;
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("获取微信素材直接文件失败", e);
			return null;
		}
	}

	/**
	 * 获取微信临时素材直接文件
	 * @param
	 * @return R
	 */
	@GetMapping("/tempMaterialOther")
	@PreAuthorize("@ss.hasPermi('wxmp:wxmsg:index')")
	public ResponseEntity<byte[]> getTempMaterialOther(String mediaId, String fileName) throws Exception {
		try {
			WxMpMaterialService wxMpMaterialService = wxService.getMaterialService();
			//获取文件
			InputStream is = new FileInputStream(wxMpMaterialService.mediaDownload(mediaId));
			byte[] body = new byte[is.available()];
			is.read(body);
			HttpHeaders headers = new HttpHeaders();
			//设置文件类型
			headers.add("Content-Disposition", "attchement;filename=" +  URLEncoder.encode(fileName, "UTF-8"));
			headers.add("Content-Type", "application/octet-stream");
			HttpStatus statusCode = HttpStatus.OK;
			//返回数据
			ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(body, headers, statusCode);
			return entity;
		} catch (WxErrorException e) {
			e.printStackTrace();
			log.error("获取微信素材直接文件失败", e);
			return null;
		}
	}
}
