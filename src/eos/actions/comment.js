import { pushEthMirrorTx } from './push-transaction'
const { YUP_CONTRACT_ACCOUNT, YUP_ACCOUNT_MANAGER, YUP_CREATOR } = process.env

export async function createcomv2 (account, data, ethAuth) {
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
          name: 'createcomv2',
          authorization: [{
            actor: YUP_CREATOR,
            permission: 'active'
          }, {
            actor: account.name,
            permission: account.authority
          } ],
          data: {
            ram_payer: YUP_CREATOR,
            postid: data.postid,
            author: account.name,
            timestamp: (new Date()).getTime(),
            comment: data.comment
          }
        }
      ]
    }
    await pushEthMirrorTx(ethAuth, txData)
  }

  export async function editcomment (account, data, ethAuth) {
    const txData = {
      actions: [
        {
          account: YUP_CONTRACT_ACCOUNT,
          name: 'noop',
          authorization: [{
            actor: YUP_CREATOR,
            permission: 'active'
          }],
          data: {}
        },
        {
          account: YUP_CONTRACT_ACCOUNT,
          name: 'editcom',
          authorization: [{
            actor: YUP_CREATOR,
            permission: 'active'
          }, {
            actor: account.name,
            permission: account.authority
          }],
          data: {
            ram_payer: YUP_CREATOR,
            commentid: data.commentid,
            comment: data.comment,
            edit_timestamp: (new Date()).getTime()
          }
        }
      ]
    }
    await pushEthMirrorTx(ethAuth, txData)
  }

  export async function deletecom (account, data, ethAuth) {
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
          name: 'deletecom',
          authorization: [{
            actor: YUP_CREATOR,
            permission: 'active'
          }, {
            actor: YUP_ACCOUNT_MANAGER,
            permission: 'active'
          }, {
            actor: account.name,
            permission: account.authority
          }],
          data: {
            ram_payer: YUP_CREATOR,
            commentid: data.commentid
          }
        }
      ]
    }
    await pushEthMirrorTx(ethAuth, txData)
  }
