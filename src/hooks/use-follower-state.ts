import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import type { FollowState } from '#/types/common'
import { fetchFollowState } from '#/api/fetchFollowState'
import { useEFPProfile } from '#/contexts/efp-profile-context'

const useFollowerState = ({
  address
}: {
  address?: Address
}) => {
  const { selectedList } = useEFPProfile()
  const { address: userAddress } = useAccount()

  const {
    data: followerStatus,
    isLoading: isFollowerStatusLoading,
    isRefetching: isFollowerStateRefetching
  } = useQuery({
    queryKey: ['follower state', address, selectedList, userAddress],
    queryFn: async () => {
      if (!address) return null

      const fetchedStatus = await fetchFollowState({
        address: address,
        userAddress,
        list: selectedList,
        type: 'follower'
      })

      return fetchedStatus
    }
  })

  const followState = useMemo((): FollowState => {
    if (!followerStatus?.state) return 'none'

    if (followerStatus.state.block) return 'blocks'
    if (followerStatus.state.mute) return 'mutes'
    if (followerStatus.state.follow) return 'follows'

    return 'none'
  }, [followerStatus])

  const isFollowerStateLoading = isFollowerStatusLoading || isFollowerStateRefetching
  const followerTag = {
    blocks: {
      text: 'blocks you',
      className: 'text-red-500'
    },
    mutes: {
      text: 'mutes you',
      className: 'text-red-500'
    },
    follows: {
      text: 'follows you',
      className: 'text-darkGray'
    },
    none: {
      text: '',
      className: 'hidden text-darkGray'
    }
  }[followState]

  return {
    followState,
    followerTag,
    isFollowerStateLoading
  }
}

export default useFollowerState