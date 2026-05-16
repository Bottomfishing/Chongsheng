import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StoryConfig, StoryNode, GameSave } from '../types/game.ts'
import storyData from '../config/story.json'

const STORAGE_KEY = 'ivg_saves'

export const useGameStore = defineStore('game', () => {
  // ==================== State ====================
  const story = ref<StoryConfig>(storyData as StoryConfig)
  const currentNodeId = ref<string>(storyData.startNodeId)
  const isPlaying = ref(false)
  const showChoices = ref(false)
  const history = ref<string[]>([])
  const choiceLog = ref<Array<{ nodeId: string; choiceId: string }>>([])
  const currentTime = ref(0)
  const duration = ref(0)

  // ==================== Getters ====================
  const currentNode = computed<StoryNode | undefined>(() =>
    story.value.nodes.find((n) => n.id === currentNodeId.value)
  )

  const isEnding = computed(() => currentNode.value?.isEnding ?? false)

  const progress = computed(() => {
    if (duration.value <= 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const allSaves = computed<GameSave[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // ==================== Actions ====================
  function startGame() {
    currentNodeId.value = story.value.startNodeId
    history.value = []
    choiceLog.value = []
    isPlaying.value = true
    showChoices.value = false
  }

  function makeChoice(choiceId: string, nextNodeId: string) {
    if (!currentNode.value) return
    choiceLog.value.push({ nodeId: currentNode.value.id, choiceId })
    history.value.push(currentNode.value.id)
    currentNodeId.value = nextNodeId
    showChoices.value = false
    isPlaying.value = true
  }

  function onVideoEnded() {
    if (currentNode.value && currentNode.value.choices.length > 0) {
      showChoices.value = true
      isPlaying.value = false
    }
  }

  function onTimeUpdate(time: number, total: number) {
    currentTime.value = time
    duration.value = total
    const node = currentNode.value
    if (node && node.triggerTime && time >= node.triggerTime && !showChoices.value && isPlaying.value) {
      showChoices.value = true
      isPlaying.value = false
    }
  }

  function saveGame(): GameSave {
    const save: GameSave = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      currentNodeId: currentNodeId.value,
      history: [...history.value],
      choiceLog: [...choiceLog.value],
    }
    const saves = allSaves.value
    saves.unshift(save)
    // 最多存 10 个存档
    if (saves.length > 10) saves.pop()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
    return save
  }

  function loadGame(saveId: string) {
    const save = allSaves.value.find((s) => s.id === saveId)
    if (!save) return false
    currentNodeId.value = save.currentNodeId
    history.value = [...save.history]
    choiceLog.value = [...save.choiceLog]
    isPlaying.value = true
    showChoices.value = false
    return true
  }

  function deleteSave(saveId: string) {
    const saves = allSaves.value.filter((s) => s.id !== saveId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
  }

  return {
    story,
    currentNodeId,
    isPlaying,
    showChoices,
    history,
    choiceLog,
    currentTime,
    duration,
    currentNode,
    isEnding,
    progress,
    allSaves,
    startGame,
    makeChoice,
    onVideoEnded,
    onTimeUpdate,
    saveGame,
    loadGame,
    deleteSave,
  }
})
