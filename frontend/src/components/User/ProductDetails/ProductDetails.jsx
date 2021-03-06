import { useEffect, useState } from 'react';
import './ProductDetails.scss'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { addToCart, getCart } from '../../../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { createAxios } from '../../../createInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const ProductDetails = (props) => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, dispatch);
    const products = useSelector((state) => state.product.products.allProducts);
    const [check, setCheck] = useState(true);
    const [product, setProduct] = useState({});
    const [image_array, setImageArray] = useState([]);
    const [num, setNum] = useState(1);
    const [size, setSize] = useState(0);
    const test1 = () => {
        setCheck(true);
    }
    const test2 = () => {
        setCheck(false);
    }
    const changeText = (event) => {
        var ptr = event.target.value;
        ptr = parseInt(ptr)
        if (Number.isInteger(ptr)) setNum(ptr);
    }

    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const changeOn = (index, bulin) => {
        setPhotoIndex(index)
        setIsOpen(bulin)
    }

    const properties = {
        dots: false,
        autoplay: false,
        indicators: true,
        transitionDuration: 500
    }
    const slideRef = useRef();
    const [pos, setPos] = useState("");
    const goto = (x, n) => {
        setPos(n);
        // var ptr = document.getElementById(pos);
        // ptr.style.border = "1px solid red";
        slideRef.current.goTo(x);
    }
    //changeCss

    const handleAddToCard = async () => {
        if (!user) {
            navigate("/login");
        } else {
            const add = {
                product_id: product.product_id,
                quantity: num,
                size
            }
            await addToCart(add, dispatch, user.token, axiosJWT);
            await getCart(dispatch, user.token, axiosJWT);
            props.setRefreshHeader(!props.refreshHeader);
            toast.success('Th??m s???n ph???m v??o gi??? th??nh c??ng!');

            //console.log("add: ", add);
        }

    }

    useEffect(() => {
        const arr = window.location.pathname.split("/");
        const id = Number(arr[arr.length - 1]);
        //console.log("id: ", id);
        //console.log("products: ", products);
        const tmp = products.find((product) => {
            return product.product_id === id;
        });
        //console.log("product: ", tmp);

        if (tmp) {
            setProduct(tmp);
            setImageArray([tmp.product_avatar, ...tmp.image_array]);
            //setImageArray(tmp.image_array);

        }
    }, [])

    return (

        <div className="container details">
            <div className="img-show">
                <div className="img-show-details">
                    <div className="list-img">

                        <ul className="slider-thumb">
                            {
                                image_array?.map((image, index) => {
                                    return (
                                        <li className="product-img" key={index}>
                                            <div className="img-" id="choice1" onClick={() => goto(index, "choice1")}  ><img alt=" Signature Tee - White 1 " src={`/images/${image}`}  ></img></div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                    <div className="Product-details-img">

                        <Slide ref={slideRef} {...properties} >
                            {/* <div onClick={() => changeOn(0, true)}><img className="product-image-feature" src={`/images/${product.product_avatar}`} alt=" Signature Tee - White 1 "></img></div> */}
                            {
                                image_array?.map((image, index) => {
                                    return <div key={index} onClick={() => changeOn(index, true)}><img className="product-image-feature" src={`/images/${image}`} alt=" Signature Tee - White 1 "></img></div>
                                })
                            }
                        </Slide>

                        {isOpen &&
                            <Lightbox
                                mainSrc={`/images/${image_array[photoIndex]}`}
                                nextSrc={`/images/${image_array[(photoIndex + 1) % image_array.length]}`}
                                prevSrc={`/images/${image_array[(photoIndex + image_array.length - 1) % image_array.length]}`}
                                onCloseRequest={() => setIsOpen(false)}
                                onMovePrevRequest={() => setPhotoIndex((photoIndex + image_array.length - 1) % image_array.length)}
                                onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % image_array.length)}
                            />

                        }


                    </div>
                </div>
            </div>
            <div className="ProductDetail-content">
                <div className="Producdetail">
                    <span className="ProductName">{product.product_name}</span>
                    <br></br>
                    <br />
                    {/* <span className="IDproduct">M?? s???n ph???m</span> */}
                </div>

                <div className="Product-price">
                    {product.discount ? <span className="Pro-sale">{product.discount}%</span> : <></>}
                    <span className="Pro-price">{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price - product.price * product.discount / 100)}</span>
                    {product.discount ? <del className="Pro-real">{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}</del> : <></>}
                </div>
                {/* {product.price - product.price * product.discount / 100} */}
                <div className="Check-box-size">
                    <span className="Size">SIZE:</span><br></br>

                    <div className="check-box">
                        <div className="abox">
                            <input type="radio" defaultChecked className="button-check" id="S" name="address" value="0" onClick={() => setSize(0)}></input>
                            <label htmlFor='S' className="charset">S</label >
                        </div>
                        <div className="abox">
                            <input type="radio" className="button-check" id="M" name="address" value="1" onClick={() => setSize(1)}></input>
                            <label htmlFor='M' className="charset">M</label >
                        </div>
                        <div className="abox">
                            <input type="radio" className="button-check" id="L" name="address" value="2" onClick={() => setSize(2)}></input>
                            <label htmlFor='L' className="charset">L</label >
                        </div>
                        <div className="abox">
                            <input type="radio" className="button-check" id="XL" name="address" value="3" onClick={() => setSize(3)}></input>
                            <label htmlFor='XL' className="charset">XL</label >
                        </div>
                    </div>
                </div>

                <div className="bar_selector">

                    <div className="quantity_button">
                        <input className="quantity_change l" type="button" value="-" onClick={() => { if (num > 1) setNum(num - 1) }} ></input>
                        <input className="text_change" type="text" value={num} onChange={(event) => changeText(event)} ></input>
                        <input className="quantity_change r" type="button" value="+" onClick={() => setNum(num + 1)} ></input>
                    </div>

                    <div className="add-to-cart">
                        <button className="button-add" onClick={() => handleAddToCard()}>Th??m v??o gi???</button>
                    </div>
                </div>

                <div className="Full-Infor">
                    <section className="Pro-details">
                        <ul className="task-bar">

                            <li className="li_cs">
                                <div className="con" onClick={() => test1()}>Ch??nh s??ch ?????i tr??? h??ng </div>
                            </li>

                            <li className="li_cs">
                                <div className="con" onClick={() => test2()}> H?????ng d???n mua h??ng</div>
                            </li>
                        </ul>
                        <div className="tab-content">
                            {
                                check ?
                                    <div className="test" id="">
                                        <div className="title2">
                                            <p><b>1. ??i???u ki???n ?????i tr???</b></p><br></br>
                                        </div>
                                        <div className="detailsnote">
                                            <p></p><p className="noname1">Qu?? Kh??ch h??ng c???n ki???m tra t??nh tr???ng h??ng h??a v?? c?? th??? ?????i h??ng/ tr??? l???i h??ng trong 3 ng??y t??nh t???i th???i ??i???m nh???n h??ng&nbsp;trong nh???ng tr?????ng h???p sau:</p><ul><li>H??ng kh??ng ????ng ch???ng lo???i, m???u m?? trong ????n h??ng ???? ?????t ho???c nh?? tr??n website t???i th???i ??i???m ?????t h??ng.<br></br></li></ul><p><br></br></p><ul><li>Kh??ng ????? s??? l?????ng, kh??ng ????? b??? nh?? trong ????n h??ng. ( Khi nh???n h??ng c??c b???n s???&nbsp;???????c ki???m tra tr?????c khi nh???n, c??c b???n c?? quy???n kh??ng nh???n h??ng khi kh??ng&nbsp;????? s??? l?????ng ho???c sai m???u. C??c tr?????ng h???p&nbsp;???? nh???n h??ng xong Shop s??? kh??ng gi???i quy???t)</li></ul><br></br><p className='noname1'>N???u trong tr?????ng h???p c??c b???n&nbsp;???? nh???n h??ng nh??ng&nbsp;?????t nh???m Size:<br></br></p><p>+ C??c b???n c?? th??? nh???n tin cho CSDL&nbsp;?????&nbsp;?????i h??ng&nbsp;????ng Size cho c??c b???n, CSDL c?? d???ch v???&nbsp;?????i tr??? h??ng t???n nh?? cho c??c b???n ( Ph?? Ship c??c b???n t??? thanh to??n nh??!)</p><p ><strong><br /><p className="title2">- S???n ph???m ???????c ?????i l?? khi :</p></strong></p><div className='noname2'><p>+ Trong 3 ng??y t??nh t??? ng??y nh???n h??ng.</p><p>+ Ch??a qua s??? d???ng ( m???c , gi???t )<br></br></p><p>+ M???c , tag&nbsp;??o c??n&nbsp;?????y&nbsp;?????.</p><p>+ C??n&nbsp;?????y&nbsp;????? h??a&nbsp;????n mua h??ng.</p><p><strong></strong><br></br></p></div>
                                        </div>

                                    </div>
                                    :
                                    <div className="test" id="">
                                        <div className="title1">
                                        </div>
                                        <div className="detailsnote">
                                            <p><span className="wysiwyg-font-size-medium"><strong></strong></span><span className="wysiwyg-font-size-medium"></span></p><p><span className="wysiwyg-font-size-medium"><strong><p className="title2">1. H?????ng d???n s??? d???ng website CSDL:</p><br></br></strong></span></p><p><span className="wysiwyg-font-size-medium"></span><span className="wysiwyg-font-size-medium"></span><span className="wysiwyg-font-size-medium"><strong></strong></span><span className="wysiwyg-font-size-medium"></span><span className="wysiwyg-font-size-medium"><strong></strong></span><span className="wysiwyg-font-size-medium"></span><span className="wysiwyg-font-size-medium"><strong></strong></span><span className="wysiwyg-font-size-medium"></span></p><p><span className="wysiwyg-font-size-medium"></span><span className="wysiwyg-font-size-medium"></span>- C??c b?????c mua h??ng t???i&nbsp;Web CSDL:</p><br /><p>+ Ch???n s???n ph???m -&gt; ch???n Size s???n ph???m -&gt; th??m v??o gi??? h??ng -&gt; thanh to??n</p><p>(Trong tr?????ng h???p c??c b???n mua nhi???u s???n ph???m, c??c b???n th??m t???ng s???n ph???m v??o gi??? h??ng, sau khi&nbsp;????&nbsp;????? s???n ph???m v?? s??? l?????ng , c??c b???n vui l??ng ki???m tra th???t k??? gi??? h??ng v??&nbsp;???n THANH TO??N)</p><br></br><p>+ Thanh to??n -&gt;&nbsp;??i???n&nbsp;?????y&nbsp;????? th??ng tin -&gt; T??n -&gt; S???&nbsp;??i???n Tho???i -&gt;&nbsp;?????a ch??? nh???n h??ng - &gt; Mail.</p><p>(&nbsp;????n h??ng th??nh c??ng l?? khi c??c b???n&nbsp;??i???n&nbsp;?????y&nbsp;????? th??ng tin v?? ch??nh x??c, c??c b???n c???n&nbsp;??i???n&nbsp;?????y&nbsp;????? th??ng tin v?? Mail&nbsp;????? CSDL c?? th??? x??c nh???n&nbsp;????n h??ng qua Mail cho c??c b???n.)</p><p><span className="wysiwyg-font-size-medium"><strong><br></br><p className="title2">2. H??nh th???c mua h??ng t???i CSDL:</p><br></br></strong></span></p><p><span className="wysiwyg-font-size-medium noname1">- C??c b???n c?? th??? mua h??ng t???i&nbsp;Web CSDL b???ng c??c h??nh th???c thanh to??n sau&nbsp;????y:</span></p><p><span className="wysiwyg-font-size-medium noname2"><strong><u className="title2">C??ch 1</u></strong><strong>:</strong>&nbsp;Thanh to??n khi nh???n h??ng t???i nh??&nbsp;(COD ??? giao h??ng v?? thu ti???n t???n n??i)</span></p><p><span className="wysiwyg-font-size-medium"><strong><u className="title2">C??ch 2</u></strong>: Thanh to??n chuy???n kho???ng tr?????c cho CSDL&nbsp;(Tr?????c khi CHUY???N KHO???N c??c b???n vui l??ng nh???n tin tr?????c cho CSDL qua Ins ho???c FB ????? ch??ng t??i ki???m tra v?? x??c nh???n ????n h??ng.)<br></br></span><br></br></p>
                                        </div>
                                    </div>
                            }
                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
}

export default ProductDetails;