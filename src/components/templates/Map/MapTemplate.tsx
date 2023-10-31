/* global kakao */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

import { setMap, setPs } from '../../../app/feachers/map/map';
import S from './MapTemplate.module.scss';

const { kakao } = window;

export interface IMap {
  location?: {
    lat: number;
    lng: number;
  };
}

const MapTemplate = ({ location }: IMap) => {
  const mapRef = useRef(null);

  const x = window.innerWidth;
  const y = window.innerHeight;

  const map = useSelector((state: RootState) => state.map.map);
  const ps = useSelector((state: RootState) => state.map.ps);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState<string>('');
  const [searchValue, setSearchValue] = useState<any>();

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

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        '<div style="padding:10px;font-size:12px;">' +
          place.place_name +
          '</div>'
      );

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
    };
    const createMap = new window.kakao.maps.Map(mapRef.current, options); //지도 생성 및 객체 리턴
    dispatch(setMap(createMap));

    /** place 관련 객체 리턴 */
    const ps = new kakao.maps.services.Places();
    dispatch(setPs({ ...ps }));
  }, [location]);

  return (
    <div className={S.MapContainer}>
      <div ref={mapRef} style={{ width: x, height: y }} />
      <div className={S.MapSearchBar}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            className={S.MapSearchInput}
            type='text'
            onChange={handleChange}
          />
          <button className={S.MapSearchBtn} onClick={searchPlaces}>
            검색
          </button>
        </div>
        <div>
          {searchValue?.map((item: any) => (
            <div
              key={item.id}
              className={S.MapSearchList}
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

export default MapTemplate;
