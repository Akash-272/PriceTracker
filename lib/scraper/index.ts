"use server"

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function ScrapAmazonProduct(url:string) {
    if(!url) return;
    //curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_feb80724-zone-web_unlocker1:d9u7l4p1fixm -k "http://geo.brdtest.com/mygeo.json"
    //BrightData  proxy configuration
    const username=String(process.env.BRIGHT_DATA_USERNAME)
    const password=String(process.env.BRIGHT_DATA_PASSWORD)
    const port=22225;
    const session_id=(1000000 * Math.random()) | 0;
    const options={
        auth:{
            username:`${username}-session-${session_id}`,
            password
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorised:false
    }

    try{
        //Fetch product page
        const response= await axios.get(url,options);
        const $=cheerio.load(response.data);
        const title=$('#productTitle').text().trim();
        const currentPrice=extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );
        
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const outOfStaock=$('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images=
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}'

        const imageUrls=Object.keys(JSON.parse(images));

        const currency=extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().trim().replace(/[-%]/g,'');
        const description=extractDescription($);
        //construct data object with scrapped information
        const data={
            url,
            currency:currency || '$',
            image:imageUrls[0],
            title,
            currentPrice:Number(currentPrice),
            originalPrice:Number(originalPrice),
            priceHistory:[],
            discountRate:Number(discountRate),
            catagory:'catagory',
            reviewsCount:100,
            stars:4.5,
            isOutOfStock:outOfStaock,
            description,
            lowestPrice:Number(currentPrice),
            highestPrice:Number(originalPrice) || Number(currentPrice),
            averagePrice:Number(currentPrice) || Number(originalPrice)




        }

        return data;
        // console.log(data);

        // console.log({title,currentPrice,originalPrice,outOfStaock,imageUrls,currency,discountRate});
        
    }catch(error:any){
        throw new Error(`Failed to scrap product : ${error.message}`)
    }
    
}