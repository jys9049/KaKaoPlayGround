/* global kakao */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';

import { useAppDispatch } from '../../app/hooks';
import { setMap, setPs } from '../../app/feachers/map/map';

const { kakao } = window;

export interface IMap {
  location?: {
    lat: number;
    lng: number;
  };
}

const Map = ({ location }: IMap) => {
  const mapRef = useRef(null);

  const x = window.innerWidth;
  const y = window.innerHeight;

  const [keyword, setKeyword] = useState<string>('');
  const [searchValue, setSearchValue] = useState<any>();
  const map = useSelector((state: RootState) => state.map.map);
  const ps = useSelector((state: RootState) => state.map.ps);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const searchPlaces = () => {
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return false;
    }
    ps.keywordSearch(keyword, placesSearchCB, { size: 15 });
  };

  const placesSearchCB = (data: any, status: any, pagination: any) => {
    setSearchValue(data);

    const result = data.reduce(
      (acc: { x: number; y: number }, item: any) => {
        acc.x += Number(item.x);
        acc.y += Number(item.y);
        return acc;
      },
      { x: 0, y: 0 }
    );

    map.setLevel(3);
    map.panTo(
      new kakao.maps.LatLng(result.y / data.length, result.x / data.length)
    );

    const bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data.length; i++) {
      displayMarker(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }

    if (status === kakao.maps.services.Status.OK) {
      // displayPlaces(data);
      // displayPagination(pagination)
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
    }
  };

  // 지도에 마커를 표시하는 함수입니다
  function displayMarker(place: any) {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
    });

    const moveLatLon = new kakao.maps.LatLng(place.y, place.x);

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' +
          place.place_name +
          '</div>'
      );

      map.setLevel(3);
      map.panTo(moveLatLon);

      infowindow.open(map, marker);
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseout', function () {
      infowindow.close();
    });
  }

  const handleListItemClick = (place: any) => {
    const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
    map.setLevel(3);
    map.panTo(moveLatLon);
  };

  useEffect(() => {
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(location?.lat, location?.lng), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    const createMap = new window.kakao.maps.Map(mapRef.current, options); //지도 생성 및 객체 리턴
    dispatch(setMap(createMap));

    /** place 관련 객체 리턴 */
    const ps = new kakao.maps.services.Places();
    dispatch(setPs({ ...ps }));
  }, [location]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: x, height: y }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '300px',
          height: `${y}px`,
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box',
          overflowY: 'scroll',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type='text'
            style={{
              width: '100%',
              height: '40px',
              padding: 0,
              paddingLeft: '10px',
              margin: 0,
              boxSizing: 'border-box',
            }}
            onChange={handleChange}
          />
          <button
            style={{
              position: 'absolute',
              top: '50%',
              right: '5px',
              transform: 'translateY(-50%)',
              backgroundColor: 'inherit',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={searchPlaces}
          >
            검색
          </button>
        </div>
        <div>
          {searchValue?.map((item: any) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px',
                gap: '4px',
                borderBottom: '1px solid grey',
                cursor: 'pointer',
              }}
              onClick={() => handleListItemClick(item)}
            >
              <h4>{item.place_name}</h4>
              <span style={{ fontSize: '12px' }}>{item.address_name}</span>
              <span style={{ fontSize: '10px' }}>{item.category_name}</span>
              <span style={{ fontSize: '10px', color: 'green' }}>
                {item.phone}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
