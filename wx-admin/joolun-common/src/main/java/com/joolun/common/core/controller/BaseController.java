package com.joolun.common.core.controller;

import java.beans.PropertyEditorSupport;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import com.joolun.common.exception.DemoModeException;
import com.joolun.common.utils.SecurityUtils;
import com.joolun.common.utils.ServletUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.joolun.common.constant.HttpStatus;
import com.joolun.common.core.domain.AjaxResult;
import com.joolun.common.core.page.PageDomain;
import com.joolun.common.core.page.TableDataInfo;
import com.joolun.common.core.page.TableSupport;
import com.joolun.common.utils.DateUtils;
import com.joolun.common.utils.StringUtils;
import com.joolun.common.utils.sql.SqlUtil;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * web层通用数据处理
 * 
 * @author ruoyi
 */
public class BaseController
{
    protected final Logger logger = LoggerFactory.getLogger(BaseController.class);

    /**
     * 将前台传递过来的日期格式的字符串，自动转化为Date类型
     */
    @InitBinder
    public void initBinder(WebDataBinder binder)
    {
        // Date 类型转换
        binder.registerCustomEditor(Date.class, new PropertyEditorSupport()
        {
            @Override
            public void setAsText(String text)
            {
                setValue(DateUtils.parseDate(text));
            }
        });
    }

    /**
     * 设置请求分页数据
     */
    protected void startPage()
    {
        PageDomain pageDomain = TableSupport.buildPageRequest();
        Integer pageNum = pageDomain.getPageNum();
        Integer pageSize = pageDomain.getPageSize();
        if (StringUtils.isNotNull(pageNum) && StringUtils.isNotNull(pageSize))
        {
            String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
            PageHelper.startPage(pageNum, pageSize, orderBy);
        }
    }

    /**
     * 响应请求分页数据
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected TableDataInfo getDataTable(List<?> list)
    {
        TableDataInfo rspData = new TableDataInfo();
        rspData.setCode(HttpStatus.SUCCESS);
        rspData.setMsg("查询成功");
        rspData.setRows(list);
        rspData.setTotal(new PageInfo(list).getTotal());
        return rspData;
    }

    /**
     * 响应返回结果
     * 
     * @param rows 影响行数
     * @return 操作结果
     */
    protected AjaxResult toAjax(int rows)
    {
        return rows > 0 ? AjaxResult.success() : AjaxResult.error();
    }

    /**
     * 页面跳转
     */
    public String redirect(String url)
    {
        return StringUtils.format("redirect:{}", url);
    }

    @ModelAttribute
    public void init(HttpServletRequest httpServletRequest, HttpServletResponse response) throws IOException
    {
        Long userId = SecurityUtils.getLoginUser().getUser().getUserId();
        if(SecurityUtils.isAdmin(userId)){//管理员直接放行
            return;
        }
        String url = ServletUtils.getRequest().getRequestURI();

        // 需要放开的url
        if (StringUtils.isNotEmpty(url) && (url.contains("/demo") || url.contains("/tool/gen")))
        {
            return;
        }

        // 增删改 请求
        if ("DELETE".equals(httpServletRequest.getMethod()) || "POST".equals(httpServletRequest.getMethod())
                || "PUT".equals(httpServletRequest.getMethod()))
        {
            throw new DemoModeException();
        }
    }
}
