import {Card, Grid, Page, Text, View} from '@components';
import {Icon} from '@iconify/react';
import LazyLoad from 'react-lazyload';
import {Link} from 'react-router-dom';
import {useTheme} from 'styled-components';

function NotFoundPage() {
  const theme = useTheme();

  return (
    <Page.Container>
      <Page.Content>
        <View style={{alignItems: 'center', marginTop: 64, marginBottom: 64}}>
          <View horizontal gap={8} style={{alignItems: 'center'}}>
            <View style={{height: 120, width: 120}}>
              <Icon icon={'mingcute:unlink-2-fill'} style={{height: 120, width: 120, color: theme.colors.blue}} />
            </View>
            <View gap={4}>
              <Text variant="large-title">Khu vực không tồn tại</Text>
              <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                Bạn đã bước vào một khu vực không tồn tại trên trang web của chúng tôi. Nhưng đừng lo lắng, hãy cùng khám phá một hành trình mới và thú vị!
              </Text>
            </View>
          </View>
        </View>
        <LazyLoad>
          <View gap={8}>
            <Grid templateColumns="auto auto" templateRows="auto auto auto auto" style={{paddingLeft: 0, paddingRight: 0, gap: 8}}>
              <Link to={'/'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideLeftIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:home-6-fill'} style={{height: 120, width: 120, color: theme.colors.red}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Trang chủ</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Chúng tôi rất hân hạnh chào đón bạn đến với trang chủ của chúng tôi - một thế giới đầy màu sắc và phong phú của văn chương. Tại đây, bạn sẽ được trải nghiệm những câu chuyện độc đáo và tuyệt vời từ các thể loại khác nhau, cùng những trải nghiệm đọc truyện không thể tả bằng lời.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/categories'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideLeftIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:grid-fill'} style={{height: 120, width: 120, color: theme.colors.blue}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Danh mục</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Đã đến lúc khám phá và tìm kiếm những câu chuyện đặc sắc từ các danh mục phong phú của chúng tôi. Chào mừng bạn đến với trang danh mục, nơi tập trung những tác phẩm đa dạng để bạn có thể thỏa sức khám phá và thưởng thức truyện.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/authors'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideRightIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:search-2-fill'} style={{height: 120, width: 120, color: theme.colors.blue}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Tìm kiếm</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Đã đến lúc kết nối với truyện một cách dễ dàng và nhanh chóng! Hãy sử dụng chức năng tìm kiếm của chúng tôi để khám phá những câu chuyện bạn yêu thích từ hàng ngàn tác phẩm phong phú.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/profile'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideRightIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:profile-fill'} style={{height: 120, width: 120, color: theme.colors.green}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Hồ sơ cá nhân</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Hãy cùng khám phá tính năng cá nhân hóa và tạo hồ sơ đặc biệt của riêng bạn trên trang hồ sơ cá nhân của chúng tôi. Đây là nơi bạn có thể kết nối, quản lý thông tin cá nhân và tùy chỉnh trải nghiệm đọc truyện theo ý muốn.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/plans'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideLeftIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:vip-1-fill'} style={{height: 120, width: 120, color: theme.colors.idigo}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Đăng ký gói</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Hãy cùng khám phá tính năng cá nhân hóa và tạo hồ sơ đặc biệt của riêng bạn trên trang hồ sơ cá nhân của chúng tôi. Đây là nơi bạn có thể kết nối, quản lý thông tin cá nhân và tùy chỉnh trải nghiệm đọc truyện theo ý muốn.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/feedback'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideLeftIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:message-1-fill'} style={{height: 120, width: 120, color: theme.colors.yellow}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Gửi phản hồi</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Ý kiến của bạn quan trọng và được đánh giá cao bởi chúng tôi. Hãy cùng chia sẻ những suy nghĩ, đánh giá và ý kiến của bạn để chúng ta cùng nhau xây dựng môi trường đọc truyện ngày càng hoàn thiện và phong phú hơn.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/policy_and_terms'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideRightIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:document-fill'} style={{height: 120, width: 120, color: theme.colors.orange}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Chính sách và điều khoản</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Ý kiến của bạn quan trọng và được đánh giá cao bởi chúng tôi. Hãy cùng chia sẻ những suy nghĩ, đánh giá và ý kiến của bạn để chúng ta cùng nhau xây dựng môi trường đọc truyện ngày càng hoàn thiện và phong phú hơn.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
              <Link to={'/introduction'} style={{textDecoration: 'none'}}>
                <Card shadowEffect animation="slideRightIn">
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                    <View style={{height: 120, width: 120}}>
                      <Icon icon={'mingcute:leaf-3-fill'} style={{height: 120, width: 120, color: theme.colors.foreground}} />
                    </View>
                    <View gap={4}>
                      <Text variant="large-title">Giới thiệu ứng dụng</Text>
                      <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        Ý kiến của bạn quan trọng và được đánh giá cao bởi chúng tôi. Hãy cùng chia sẻ những suy nghĩ, đánh giá và ý kiến của bạn để chúng ta cùng nhau xây dựng môi trường đọc truyện ngày càng hoàn thiện và phong phú hơn.
                      </Text>
                    </View>
                  </View>
                </Card>
              </Link>
            </Grid>
          </View>
        </LazyLoad>
      </Page.Content>
    </Page.Container>
  );
}

export default NotFoundPage;
