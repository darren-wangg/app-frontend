import { pushEthMirrorTx } from './push-transaction'
const { YUP_CONTRACT_ACCOUNT, YUP_ACCOUNT_MANAGER, YUP_CREATOR } = process.env

export async function follow (account, data, ethAuth) {
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
          name: 'follow',
          authorization: [{
            actor: account.name,
            permission: account.authority
          }, {
            actor: YUP_CREATOR,
            permission: 'active'
          }],
          data: {
            ram_payer: YUP_CREATOR,
            follower: account.name,
            account_to_follow: data.accountToFollow
          }
        }
      ]
    }
    await pushEthMirrorTx(ethAuth, txData)
  }

  export async function unfollow (account, data, ethAuth) {
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
          name: 'unfollow',
          authorization: [{
            actor: account.name,
            permission: account.authority
          }, {
            actor: YUP_CREATOR,
            permission: 'active'
          }],
          data: {
            ram_payer: YUP_CREATOR,
            follower: account.name,
            account_to_unfollow: data.accountToUnfollow
          }
        }
      ]
    }
    await pushEthMirrorTx(ethAuth, txData)
  }
