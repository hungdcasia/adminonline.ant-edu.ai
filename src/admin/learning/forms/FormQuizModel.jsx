import { Guid } from "js-guid"

function formQuizModel(item) {
  return {
      id: item?.id ?? Guid.EMPTY,
      title: item?.title ?? '',
      description: item?.description ?? '',
      content: '',
      type: item?.type ?? '',
      lessonId: item?.lessonId ?? null,
      active: item?.active ?? false,
      time: item?.time ?? null,
  }
}

function formQuizQuestionModel(item) {
  return {
      id: item?.id ?? Guid.EMPTY,
      title: item?.title ?? '',
      content: item?.description ?? '',
      answers: []
  }
}

export { formQuizModel, formQuizQuestionModel }