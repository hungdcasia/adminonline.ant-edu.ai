import { Fragment, useEffect, useState } from "react"
import { string_truncate, useForm, useFormField } from "../../../helpers"
import { lessonService } from "../../services"
import { alertActions } from "../../../actions"
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CFormGroup, CInvalidFeedback, CLabel, CModal, CModalBody, CModalHeader, CRow } from "@coreui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { DateTimeInput, NumberInput, TextInput } from "../../shared"
import { Guid } from "js-guid"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { formQuizModel, formQuizQuestionModel } from "./FormQuizModel"

const QuizType = {
  SingleChoice: 'SingleChoice',
  MutipleChoice: 'MutipleChoice',
  FreeText: 'FreeText'
}

const QuizTypeDS = [
  { id: QuizType.SingleChoice, name: QuizType.SingleChoice },
  { id: QuizType.MutipleChoice, name: QuizType.MutipleChoice },
  // { id: QuizType.FreeText, name: QuizType.FreeText },
]

const questionFields = [
  { key: "#", label: "#", _style: { width: '5%' } },
  { key: "title", label: "Câu hỏi", _style: { width: '30%' } },
  { key: "content", label: "Nội dung", _style: { width: '30%' } },
  { key: "type", label: "type", _style: { width: '15%' } },
  { key: "action", label: "", _style: { width: '10%' } }
];

const FormQuiz = ({ item, lesson, courseId, course, chapters, onSuccess, onCancel }) => {

  let [editQuestion, setEditQuestion] = useState()
  let [title] = useFormField({ value: item.title, rules: [{ rule: 'required', message: 'Please Input' }] })
  let [time] = useFormField({value: item.time})
  let [description, setDescription] = useState(item.description)
  let [questions, setQuestions] = useState(item.content ? JSON.parse(item.content) : [])
  let [form] = useForm([title,])

  // useEffect(() => {
  //     if (item.id !== 0)
  //         lessonService.getDetail(item.id)
  //             .then(res => {
  //                 if (res.isSuccess) {
  //                     setQuestions(JSON.parse(res.data.content))
  //                 }
  //             })
  // }, [])

  const validateQuestions = () => {
      if (questions.length == 0) {
          alertActions.error('Vui lòng tạo câu hỏi!')
          return false;
      }

      return true
  }

  const onSubmit = e => {

      if (!form.valid() || !validateQuestions()) {
          return;
      }
      var model = {
          id: item.id,
          title: title.value,
          description: description,
          content: JSON.stringify(questions),
          type: item.type,
          lessonId: lesson.id,
          time: time?.value,
      };

      let promise = null;
      if (item.id === Guid.EMPTY) {
          promise = lessonService.createQuiz(model);
      } else {
          promise = lessonService.updateQuiz(model);
      }

      promise.then((res) => {
          if (res.isSuccess) {
              alertActions.successUpdate();
              onSuccess(res.data);
          }
      });
  }

  const deleteQuestionClicked = (item) => {
      let index = questions.findIndex(r => r.id === item.id);
      if (index === -1) return
      questions.splice(index, 1)
      setQuestions([...questions])
  }

  const onEditQuestionSuccess = (item) => {
      setEditQuestion(false)

      if (item.id === Guid.EMPTY) {
          item.id = Guid.newGuid().toString()
          questions.push(item)
          setQuestions([...questions])
          return
      }

      let index = questions.findIndex(r => r.id === item.id);
      if (index === -1) return

      questions[index] = item
      setQuestions([...questions])
  }

  return (
      <>
          <CRow alignHorizontal='center'>
              <CCol xs='12'>
                  <nav className="navbar navbar-expand-lg navbar-light bg-light">
                      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                          <span className="navbar-brand h4">{item.id === Guid.EMPTY ? 'Thêm quiz' : 'Cập nhật quiz'}{` cho ${lesson.name}`}</span>
                          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                          </ul>
                          <div className="form-inline my-2 my-lg-0">
                              <CButton className={'float-right mr-3'}
                                  color="success"
                                  onClick={onSubmit}>
                                  <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                              </CButton>
                              <CButton className={'float-right mb-0'}
                                  color="info"
                                  onClick={onCancel}>
                                  <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                              </CButton>
                          </div>
                      </div>
                  </nav>
                  <CRow>
                      <CCol xs="12" lg="12" >
                          <CCard>
                              <CCardHeader>
                                  <span className='h5'>Thông tin Quiz</span>
                              </CCardHeader>
                              <CCardBody>
                                  <TextInput name='title'
                                      label='Tiêu đề'
                                      required
                                      field={title}
                                  />

                                  <NumberInput name='title'
                                      label='Thời gian (giây)'
                                      rawProps={{placeholder:"Nếu bỏ trống, thời gian làm bài không giới hạn"}}
                                      field={time}
                                  />

                                  <CFormGroup>
                                      <CLabel>Mô tả</CLabel>
                                      <CKEditor
                                          editor={ClassicEditor}
                                          config={{
                                              fontSize: {
                                                  options: [
                                                      9,
                                                      11,
                                                      13,
                                                      'default',
                                                      17,
                                                      19,
                                                      21
                                                  ]
                                              },
                                              toolbar: [
                                                  'sourceEditing', '|',
                                                  'heading', '|',
                                                  'fontfamily', 'fontsize', "fontBackgroundColor", "fontColor", '|',
                                                  'bold', 'italic', 'strikethrough', 'underline', 'alignment', '|',
                                                  'bulletedList', 'numberedList', 'todoList', '|',
                                                  'link', '|',
                                                  'outdent', 'indent', '|',
                                                  'htmlEmbed', 'blockQuote', '|',
                                                  'undo', 'redo', '|',
                                                  'highlight',
                                              ]
                                          }}
                                          data={description}
                                          onChange={(event, editor) => {
                                              const data = editor.getData()
                                              setDescription(data)
                                          }}
                                          onReady={(editor) => {
                                              // You can store the "editor" and use when it is needed.
                                              // console.log("Editor is ready to use!", editor);
                                              editor.editing.view.change((writer) => {
                                              writer.setStyle(
                                                  "height",
                                                  "400px",
                                                  editor.editing.view.document.getRoot()
                                              );
                                              });
                                          }}
                                      />
                                  </CFormGroup>

                              </CCardBody>
                          </CCard>

                          <CCard>
                              <CCardHeader className="container-fluid">
                                  <span className="h5">Danh sách câu hỏi</span>
                                  <div className="float-right">
                                      <CButton type="link" onClick={() => { setEditQuestion(new formQuizQuestionModel()) }}>
                                          Thêm
                                      </CButton>
                                  </div>
                              </CCardHeader>
                              <CCardBody>
                                  <CDataTable
                                      items={questions}
                                      fields={questionFields}
                                      striped
                                      hover
                                      border
                                      itemsPerPage={20}
                                      pagination
                                      scopedSlots={{
                                          '#': (item, index) => (
                                              <td>
                                                  {index + 1}
                                              </td>
                                          ),
                                          'title': (item) => {
                                              return (
                                                  <td>
                                                      {item.title}
                                                  </td>
                                              )
                                          },
                                          'content': (item) => {
                                              return (
                                                  <td>
                                                      {string_truncate(item.content, 50)}
                                                  </td>
                                              )
                                          },
                                          'type': (item) => {
                                              return (
                                                  <td>{item.type}</td>
                                              )
                                          },
                                          'action': (item, index) => (
                                              <td >
                                                  <div className="py-2 d-flex justify-content-center">
                                                      <CButton
                                                          color="light"
                                                          size="sm"
                                                          onClick={() => { setEditQuestion(item) }}
                                                      >
                                                          <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                                      </CButton>
                                                      <CButton
                                                          className='ml-3'
                                                          color="light"
                                                          size="sm"
                                                          onClick={() => { deleteQuestionClicked(item) }}
                                                      >
                                                          <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                                      </CButton>
                                                  </div>
                                              </td>
                                          )
                                      }}
                                  />
                              </CCardBody>
                          </CCard>
                          {editQuestion &&
                              <CModal show={true}
                                  scrollable
                                  size='lg'
                                  onClose={() => setEditQuestion(false)}>
                                  <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                                      Câu hỏi
                                  </CModalHeader>
                                  <CModalBody>
                                      <QuestionForm quiz={editQuestion} onCancel={() => setEditQuestion(false)}
                                          onSuccess={onEditQuestionSuccess} />
                                  </CModalBody>
                              </CModal>
                          }
                      </CCol>
                  </CRow>
              </CCol>
          </CRow>
      </>
  );
}

const QuestionForm = ({ quiz, onCancel, onSuccess }) => {
  let [title, setTitle] = useFormField({ value: quiz.title ?? '', rules: [{ rule: 'required', message: 'please input' }] })
  let [content, setContent] = useFormField({ value: quiz.content ?? '', rules: [] })

  let [type, setType] = useState(quiz.type ?? QuizType.SingleChoice)
  const [inputList, setInputList] = useState(quiz.answers.map(item => { return { content: item.content, id: item.id, right: item.right, error: '' } }));
  let [form] = useForm([title, content])
  let [error, setError] = useState('');


  const checkValidAnswers = () => {
      if (type == QuizType.FreeText)
          return true

      var isvalid = true;
      for (let i = 0; i < inputList.length; i++) {
          const answer = inputList[i];
          if (!answer || answer == '') {
              answer.error = 'Nhập nội dung đáp án.'
              isvalid = false;
          }
      }
      if (!isvalid) {
          setInputList([...inputList]);
      }

      //no right answer
      if (inputList.length == 0) {
          setError('Tạo ít nhất 1 đáp án');
          isvalid = false;
      }

      return isvalid;
  }

  const onSubmit = () => {
      if (form.valid() && checkValidAnswers()) {
          var model = {
              id: quiz.id ?? Guid.EMPTY,
              title: title.value,
              content: content.value,
              type: type,
              answers: type == QuizType.FreeText ? [] : inputList.map(item => {
                  return {
                      content: item.content,
                      id: item.id,
                      right: item.right,
                  }
              })
          }

          onSuccess(model)
      }
  }

  const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value;
      list[index]['error'] = '';
      setInputList(list);
  };

  const handleRightClick = (e, index) => {
      const { name, checked } = e.target;
      const list = [...inputList];
      if (type == QuizType.MutipleChoice) {
          list[index][name] = checked;
      } else {
          list.forEach((e, i) => {
              e[name] = index == i;
          });
      }

      setInputList(list);
      setError('')
  }

  // handle click event of the Remove button
  const handleRemoveClick = index => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
      if (inputList.length == 5)
          return;
      setInputList([...inputList, { content: "", id: Guid.newGuid().toString(), right: false, error: '' }]);
  };

  return (
      <CCard className='m-0 border-0'>
          <CCardBody>
              <CFormGroup>
                  <CLabel htmlFor=''>Loại câu hỏi *</CLabel>
                  <select className={`custom-select`}
                      value={type}
                      onChange={(e) => { setType(e.target.value); inputList.forEach(e => e.right = false); setInputList([...inputList]) }}
                  >
                      {QuizTypeDS.map(r => (
                          <option value={r.id} key={r.id}>{r.name}</option>
                      ))}
                  </select>
              </CFormGroup>

              <TextInput name='title'
                  label='Tiêu đề'
                  rawProps={{}}
                  required
                  field={title}
              />
              <TextInput name='content'
                  label='Nội dung'
                  rawProps={{}}
                  field={content}
              />
              {type != QuizType.FreeText &&
                  <>
                      <CLabel>Đáp án</CLabel>
                      <CFormGroup>
                          <CRow >
                              {inputList.map((answer, index) => {
                                  return (
                                      <Fragment key={index}>
                                          <CCol xs='12' lg='12' className='form-inline mb-1'>
                                              <button className=" btn mr-3"
                                                  disabled={inputList.length == 1}
                                                  onClick={() => handleRemoveClick(index)}>
                                                  <FontAwesomeIcon icon={allIcon.faMinusCircle} className='text-danger' style={{ fontSize: '18x' }} />
                                              </button>
                                              <div className="form-check">
                                                  <input className="form-check-input"
                                                      type={type === QuizType.SingleChoice ? "radio" : 'checkbox'}
                                                      name="right"
                                                      id={index}
                                                      checked={answer.right}
                                                      onChange={() => { }}
                                                      onClick={(e) => handleRightClick(e, index)} />
                                              </div>
                                              <CFormGroup>
                                                  <input className={`form-control ${answer.error == '' ? '' : 'is-invalid'}`}
                                                      type='text'
                                                      name="content"
                                                      value={answer.content}
                                                      style={{ minWidth: '350px' }}
                                                      onChange={e => handleInputChange(e, index)}
                                                  />
                                              </CFormGroup>
                                          </CCol>
                                          <CCol xs='12' lg='12' className='form-inline'>
                                              {answer.error != '' &&
                                                  <CInvalidFeedback > {answer.error}</CInvalidFeedback>
                                              }
                                          </CCol>
                                      </Fragment>
                                  );
                              })}
                          </CRow>
                          {inputList.length < 5 &&
                              < CRow >
                                  <CCol xs='12' lg='12' className='form-inline'>
                                      <button onClick={handleAddClick} className='btn'>
                                          <FontAwesomeIcon icon={allIcon.faPlusCircle} className='text-success' style={{ fontSize: '18x' }} />
                                      </button>
                                  </CCol>
                              </CRow>
                          }
                          <CLabel className='text-danger'>{error}</CLabel>
                      </CFormGroup>
                  </>
              }
          </CCardBody>
          <CCardFooter>
              <div className="card-header-actions">
                  <CButton className={'float-right'}
                      color="danger"
                      onClick={onCancel}>
                      <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                  </CButton>
                  <CButton className={'float-right mr-3'}
                      color="success"
                      onClick={onSubmit}>
                      <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                  </CButton>
              </div>
          </CCardFooter>
      </CCard >
  )
}


export default FormQuiz;
