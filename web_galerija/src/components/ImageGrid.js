import React, { useEffect } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Container, Button } from "react-bootstrap";
import { useUserAuth } from '../context/UserAuthContext';

const ImageGrid = ({ collection, docID }) => {

    const { posts, deletePost } = useFirestore(collection, docID);
    const { user } = useUserAuth();

    const handleDelete = async (post) => {
        const postID = post.id;

        if (post.postedBy === user.email) {
            const result = posts.filter((post) => post.id !== postID)
            deletePost(result);
        }
        else {
            alert("Cannot delete other users posts!");
        }

    }

    useEffect(() => {
    }, [docID, posts])

    return (
        <Container>
            <div className="row row-cols-1 row-cols-lg-4 row-cols-md-3 row-cols-sm-1 mt-5 g-3">
                {posts && posts.map((post) => (
                    <div className="col m-auto d-flex justify-content-center" key={post.id}>
                        <figure className="figure">
                            <div className='img-container'>
                                <img src={post.url}
                                    className="figure-img img-fluid rounded img-thumbnail"
                                    alt={post.description}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }} />
                                <div className='overlay'>
                                    <figcaption className="figure-caption">
                                        <h5>Posted by:</h5>
                                        <p>{post.postedBy}</p>
                                        <p className='img-decription'>{post.description}</p>
                                        <Button variant="outline-danger" onClick={() => handleDelete(post)}>Delete</Button>
                                    </figcaption>
                                </div>
                            </div>
                        </figure>
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default ImageGrid;