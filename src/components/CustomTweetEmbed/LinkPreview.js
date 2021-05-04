/* eslint-disable */
import React, { Component, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import _ from 'lodash'


const LinkPreview = ({ description, image, title, url, caption, classes, size }) => {
 const cutEnd = (str) => {
  let newString = ''
  let lastFour = []
  let count = 0
  for (let i = 0; i < str.length - 3; i++) {
     let f = str[i]
     let s = str[i + 1]
     let t = str[i + 2]
     let fourth = str[i + 3]

     if (count === 4) {
       count = 0
       lastFour = []
     } else {
       lastFour[0] = f
        lastFour[1] = s
        lastFour[2] = t
        lastFour[3] = fourth
        if (
            (lastFour[0] === '.') && (lastFour[1] === 'c') && (lastFour[2] === 'o') && (lastFour[3] === 'm')
            ) {
          return `${newString}.com`
        }
        count += 1
     }
      newString += str[i]
    }
  }

  const cutHttp = (str = '') => {
    let parsed;
    if (str && str.includes(`http:`)) {
        const re = /http:\/\//
        parsed = str.replace(re, '')
        return parsed
    } else if (str && str.includes(`https:`)) {
        const re = /https:\/\//
        parsed = str.replace(re, '')
        return parsed
    }
  }

  const trimUrl = (str) => {
    let first;
    let second;
    if (str.length > 0) {
      first = cutEnd(str)
      second = cutHttp(first)
    }

    return second
  }

  let LinkPreviewMain = classes.LinkPreviewMain
  let LinkPreviewImageContainer = classes.LinkPreviewImageSmallContainer
  let LinkPreviewImage = classes.LinkPreviewImageSmall
  let LinkPreviewContent = classes.LinkPreviewContentSmall
  let LinkPreviewTitle = classes.LinkPreviewTitle
  let LinkPreviewText = classes.LinkPreviewText
  let LinkPreviewURL = classes.LinkPreviewURL

  if (size === 'large') {
   LinkPreviewImage = classes.LinkPreviewImageLarge
   LinkPreviewContent = classes.LinkPreviewContentLarge
   LinkPreviewMain = classes.LinkPreviewMainLarge
  }

  return (
    <div className={LinkPreviewMain}>
      <a className={classes.LinkPreviewAnchor}
        href={url}
        target='_blank'
      >
        <div className={LinkPreviewImageContainer}>
          <img className={LinkPreviewImage}
            src={image}
            alt=''
          />
        </div>
      </a>
      <a className={classes.LinkPreviewAnchor}
        href={url}
        target='_blank'
      >
        <div className={LinkPreviewContent}>
          <div className={LinkPreviewTitle}>{title}</div>
          <div className={LinkPreviewText}>{`${description && description.substring(0, 50)}...` || `${caption && caption.substring(0, 50)}...`} </div>
          <div className={LinkPreviewURL}>{url && trimUrl(url)}</div>
        </div>
      </a>
    </div>
  )
}

export default LinkPreview
