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
package com.joolun.weixin.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

/**
 * LocalDateTime时间工具
 */
public class LocalDateTimeUtils {

	public static final String YYYY = "yyyy";
	public static final String YYYYMM = "yyyyMM";
	public static final String YYYYMMDD = "yyyyMMdd";
	public static final String YYYYMMDDHH = "yyyyMMddHH";
	public static final String YYYYMMDDHHMM = "yyyyMMddHHmm";
	public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
	public static final String YYYY_MM = "yyyy-MM";
	public static final String YYYY_MM_DD = "yyyy-MM-dd";
	public static final String YYYY_MM_DD_HH = "yyyy-MM-dd HH";
	public static final String YYYY_MM_DD_HH_MM = "yyyy-MM-dd HH:mm";
	public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";

	private static final String BASE_TIME_FORMAT = "[yyyyMMddHHmmss][yyyyMMddHHmm][yyyyMMddHH][yyyyMMdd][yyyyMM][yyyy][[-][/][.]MM][[-][/][.]dd][ ][HH][[:][.]mm][[:][.]ss][[:][.]SSS]";
	/**
	 * 【推荐】解析常用时间字符串，支持,并不局限于以下形式：
	 * [yyyy][yyyy-MM][yyyy-MM-dd][yyyy-MM-dd HH][yyyy-MM-dd HH:mm][yyyy-MM-dd HH:mm:ss][yyyy-MM-dd HH:mm:ss:SSS]
	 * [yyyy][yyyy/MM][yyyy/MM/dd][yyyy/MM/dd HH][yyyy/MM/dd HH:mm][yyyy/MM/dd HH:mm:ss][yyyy/MM/dd HH:mm:ss:SSS]
	 * [yyyy][yyyy.MM][yyyy.MM.dd][yyyy.MM.dd HH][yyyy.MM.dd HH.mm][yyyy.MM.dd HH.mm.ss][yyyy.MM.dd HH.mm.ss.SSS]
	 * [yyyy][yyyyMM][yyyyMMdd][yyyyMMddHH][yyyyMMddHHmm][yyyyMMddHHmmss]
	 * [MM-dd]
	 * 不支持yyyyMMddHHmmssSSS，因为本身DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")就不支持这个形式
	 *
	 * @param timeString
	 * @return
	 */
	public static LocalDateTime parse(String timeString) {
		return LocalDateTime.parse(timeString, getDateTimeFormatterByPattern(BASE_TIME_FORMAT));
	}

	/**
	 * 根据传进来的pattern返回LocalDateTime，自动补齐
	 *
	 * @param timeString
	 * @param pattern
	 * @return
	 */
	public static LocalDateTime parseByPattern(String timeString, String pattern) {
		return LocalDateTime.parse(timeString, getDateTimeFormatterByPattern(pattern));
	}

	private static DateTimeFormatter getDateTimeFormatterByPattern(String pattern) {
		return new DateTimeFormatterBuilder()
				.appendPattern(pattern)
				.parseDefaulting(ChronoField.YEAR_OF_ERA, LocalDateTime.now().getYear())
				.parseDefaulting(ChronoField.MONTH_OF_YEAR, LocalDateTime.now().getMonthValue())
				.parseDefaulting(ChronoField.DAY_OF_MONTH, 1)
				.parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
				.parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
				.parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
				.parseDefaulting(ChronoField.NANO_OF_SECOND, 0)
				.toFormatter();
	}

	/**
	 * 将timestamp转为LocalDateTime
	 * @param timestamp
	 * @return
	 */
	public static LocalDateTime timestamToDatetime(long timestamp){
		Instant instant = Instant.ofEpochMilli(timestamp);
		return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
	}

	/**
	 * 将LocalDataTime转为timestamp
	 * @param ldt
	 * @return
	 */
	public static long datatimeToTimestamp(LocalDateTime ldt){
		ZoneId zone = ZoneId.systemDefault();
		return ldt.atZone(zone).toInstant().toEpochMilli();
	}

	public static void main(String[] args) {
		long timeStamp = 1382694957000l;
		System.out.println(timestamToDatetime(timeStamp));
	}
}