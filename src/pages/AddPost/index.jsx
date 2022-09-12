import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useEffect } from 'react';

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth)
  const inputFileRef = useRef(null)
  const navigate = useNavigate()
  const { id } = useParams();

  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [text, setText] = useState('');

  const handleChangeFile = async (event) => {
    try {
      setIsLoading(true)
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);

      setImageUrl(data.url)
    } catch (err) {
      console.warn(err);
      alert('Oшибка при загрузке файла!')
    } finally {
      setIsLoading(false)
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const handleSubmit = async () => {
    try {
      const fields = {
        title,
        text,
        tags: tags.split(','),
        imageUrl,
      }

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)
      const _id = data._id;

      navigate(`/posts/${isEditing ? id : _id}`)

    } catch (err) {
      console.warn(err);
      alert(`Не удалось ${isEditing ? 'сохранить' : 'опубликовать'} статью!`)
    }
  }

  const checkIsEditing = async () => {
    if (isEditing) {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        const { title, text, tags, imageUrl } = data;

        setTitle(title)
        setText(text)
        setTags(tags.join(','))
        setImageUrl(imageUrl)
      } catch (err) {
        console.warn(err);
      }
    }
  }

  useEffect(() => {
    checkIsEditing()
  }, [])

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => { inputFileRef.current.click() }}
        variant="outlined"
        size="large">
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          {isLoading ?
            <CircularProgress /> :
            <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />}
        </>
      )}
      <br />
      <br />
      <TextField
        value={title}
        onChange={(e) => { setTitle(e.target.value) }}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => { setTags(e.target.value) }}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={handleSubmit} size="large" variant="contained">
          {
            isEditing ? 'Сохранить' : 'Опубликовать'
          }
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
