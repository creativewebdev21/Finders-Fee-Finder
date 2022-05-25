import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const shareDirectory = path.join(process.cwd(), 'share');

export function getAllShareIds() {
   const fileNames = fs.readdirSync(shareDirectory);
 
   // Returns an array that looks like this:
   // [
   //   {
   //     params: {
   //       id: 'ssg-ssr'
   //     }
   //   },
   //   {
   //     params: {
   //       id: 'pre-rendering'
   //     }
   //   }
   // ]
   return fileNames.map((fileName) => {
     return {
       params: {
         id: fileName.replace(/\.md$/, ''),
       },
     };
   });
 }

 export function getShareData(id) {
   const fullPath = path.join(shareDirectory, `${id}.md`);
   const fileContents = fs.readFileSync(fullPath, 'utf8');
 
   // Use gray-matter to parse the post metadata section
   const matterResult = matter(fileContents);
 
   // Combine the data with the id
   return {
     id,
     ...matterResult.data,
   };
 }