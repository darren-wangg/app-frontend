import { pushEthMirrorTx } from './push-transaction'

const { YUP_CONTRACT_ACCOUNT, YUP_ACCOUNT_MANAGER, YUP_CREATOR } = process.env

export async function createvote (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'createvotev3',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: account.authority
        }],
        data: {
          ram_payer: YUP_CREATOR,
          voter: account.name,
          postid: data.postid,
          rating: data.rating,
          like: !!data.like,
          category: data.category
        }
      }
    ]
  }
  await pushEthMirrorTx(ethAuth, txData)
}

export async function postvotev3 (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'postvotev3',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: account.authority
        }],
        data: {
          ram_payer: YUP_CREATOR,
          postid: data.postid,
          author: YUP_CREATOR,
          caption: data.caption || '',
          img_hash: data.imgHash || '',
          video_hash: data.videoHash || '',
          tag: data.tag || 'general',
          voter: account.name,
          like: data.like,
          category: data.category,
          rating: data.rating
        }
      }]
  }
  await pushEthMirrorTx(ethAuth, txData)
}

export async function postvotev4 (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'postvotev4',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: account.authority
        }],
        data: {
          ram_payer: YUP_CREATOR,
          postid: data.postid,
          author: YUP_CREATOR,
          caption: data.caption || '',
          img_hash: data.imgHash || '',
          video_hash: data.videoHash || '',
          tag: data.tag || 'general',
          voteid: data.voteid,
          voter: account.name,
          like: data.like,
          category: data.category,
          rating: data.rating
        }
      }]
  }
  await pushEthMirrorTx(ethAuth, txData)
}

export async function createvotev4 (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'createvotev4',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: 'active'
        }],
        data: {
          ram_payer: YUP_CREATOR,
          voteid: data.voteid,
          voter: account.name,
          postid: data.postid,
          like: !!data.like,
          category: data.category,
          rating: data.rating || 1
        }
      }
    ]
  }
  await pushEthMirrorTx(ethAuth, txData)
}

export async function editvote (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'editvotev2',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: account.authority
        }],
        data: {
          ram_payer: YUP_CREATOR,
          voteid: data.voteid,
          like: !!data.like,
          rating: data.rating,
          category: data.category
        }
      }
    ]
  }
  await pushEthMirrorTx(ethAuth, txData)
}

export async function deletevote (account, data, ethAuth) {
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'deletevote',
        authorization: [{
          actor: YUP_CREATOR,
          permission: 'active'
        }, {
          actor: account.name,
          permission: account.authority
        }],
        data: {
          ram_payer: YUP_CREATOR,
          voteid: data.voteid
        }
      }
    ]
  }
  await pushEthMirrorTx(ethAuth, txData)
}
